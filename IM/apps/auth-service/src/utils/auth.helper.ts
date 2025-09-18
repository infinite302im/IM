import crypto from "crypto";
import { ValidationError } from "@packages/error-handler";
import { NextFunction } from "express";
import redis from "@packages/libs/redis";
import { sendEmail } from "./sendMail";


const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateRegistrationData = (data:any, userType: "user" | "seller") => {
    const { name,email,password,phone_number,country} = data;

    if(
        !name || !email || !password || (userType === "seller" && (!phone_number || !country))
    ){
        throw new ValidationError(`Miising required fields!`)
    }

    if(!emailRegex.test(email)){
        throw new ValidationError("Invalid email format");
    }
};

export const checkOtpRestrictions = async(email:string,next:NextFunction) => {
    if(await redis.get(`otp_lock:${email}`)){
        return next(new ValidationError("Account is locked due to multiple failure attempts! Try again after 30minutes"));
    }
    if(await redis.get(`otp_spam_lock:${email}`)){
        return next(new ValidationError("Too many OTP requests! Please wait 1hour before requesting again"));
    }
    if(await redis.get(`otp_cooldown:${email}`)){
        return next (new ValidationError("Please wait 1minute before requesting a new OTP!"));
    }


};

export const trackOtpRequests = async(email:string,next:NextFunction) => {
    const otpRequestsKey = `otp_request_count:${email}`;
    let otpRequests = parseInt((await redis.get(otpRequestsKey)) || "0");

    if(otpRequests >= 2){
        await redis.set(`otp_spam_lock:${email}`, "loxked", "EX", 3600);// Lock for 1hour
        return next(new ValidationError("Too many OTP requests. Please wait 1hour before requesting again."));
    }
    await redis.set(otpRequestsKey, otpRequests + 1, "EX", 3600);//tracking requests for 1hour
};

export const sendOtp = async(name:string,email:string,template: string) => {
    const otp = crypto.randomInt(10000, 99999).toString();
    await sendEmail(email, "Verify Your Email", template, {name,otp});
    await redis.set(`$otp:${email}`, otp, "EX", 300);
    await redis.set(`otp_cooldown:${email}`, "true", "EX", 60);   
};
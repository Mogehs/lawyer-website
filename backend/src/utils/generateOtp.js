export const generateOtp = (lenght = 6) => {
    let otp = '';
    for (let i = 0; i < lenght; i++) {
        otp += Math.floor(Math.random() * 10)
    }
    return otp;
}
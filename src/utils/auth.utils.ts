

const validateEmail = (email:string):boolean => {
    if(!email.includes("@")) {
        return false;
    } 

    let [firstPart,secondPart] = email.split("@");
    if(firstPart.length < 1) {
        return false;
    }
    
    let emailSuffixes = [
        // Generic TLDs
        ".com", ".org", ".net", ".edu", ".gov", ".mil", ".int", ".biz", ".info", ".pro",
        
        // Common Country Code TLDs
        ".us", ".uk", ".ca", ".fr", ".de", ".jp", ".au", ".br", ".ch", ".cn",
        ".es", ".in", ".it", ".nl", ".nz", ".ru", ".se", ".kr", ".eu", ".mx",
        
        // Common Second-Level Domains
        ".co.uk", ".co.jp", ".com.au", ".com.br", ".com.cn", ".co.in", ".com.mx",
        ".co.nz", ".com.sg", ".com.tr",
        
        // New gTLDs
        ".online", ".website", ".app", ".blog", ".shop", ".store", ".tech", ".cloud",
        ".agency", ".design", ".dev", ".io", ".me", ".xyz", ".co", ".ai", ".gg",
        
        // Academic and Government
        ".ac.uk", ".edu.au", ".edu.cn", ".gov.uk", ".gov.au",
        
        // Business and Professional
        ".ltd.uk", ".plc.uk", ".inc", ".llc", ".business", ".company"
    ];

    let isSecondPartValid=false;
    for(let i=0;i<emailSuffixes.length;i++) {
        if(secondPart.includes(emailSuffixes[i])) {
            isSecondPartValid=true;
            break;
        }
    }

    if(!isSecondPartValid) return false;
    
    return true
}

const isPasswordStrong = (password:string):boolean =>  {
    // password min length should be 6
    // password should have atleast 1 special char
    // password should have atleast 1 uppercase char
    const specialChars:string = "~!@#$%^&*()_+-={}[]|\\:;'<>,.?/";
    const upperCaseChars:string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";


    if(password.length < 6) {
        return false;
    }

    let hasSpecialChar = false;
    for(let i=0;i<specialChars.length;i++) {
        if(password.includes(specialChars[i])) {
            hasSpecialChar=true;
            break;
        }
    }
    if(!hasSpecialChar) return false;

    let hasUpperCase = false;
    // check for uppercase 
    for(let i=0;i<upperCaseChars.length;i++) {
        if(password.includes(upperCaseChars[i])) {
            hasUpperCase = true;
            break;
        }
    }
    if(!hasUpperCase) return false;

    return true;
}

export {
    validateEmail,
    isPasswordStrong,
};

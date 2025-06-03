/**
 * Enumeration of possible conditions that can trigger messages.
 * Each condition represents a specific state or error that might occur.
 */
export enum CONDITIONS {
  EMAIL_NOT_FOUND,            
  ACCOUNT_SUSPENDED,          
  WRONG_PASSWORD,              
  CAPTCHA_FAILED,               
  TOO_MANY_LOGIN_ATTEMPTS,     
  IP_BLOCKED,                   
  LOCATION_ANOMALY,             
  DEVICE_UNAUTHORIZED,         
  ACCOUNT_DEACTIVATED_BY_USER, 
  EMAIL_DELIVERY_FAILED,       
  ACCOUNT_LOCKED_DUE_TO_FAILED_LOGINS,
}
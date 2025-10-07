# Authentication Guide

## Overview

Ethiopia Market uses **OTP (One-Time Password) authentication** with Ethiopian phone numbers. This is a common authentication method in Ethiopia and other developing markets where SMS is more accessible than email.

## Features

### 1. Login Flow

```
User enters phone number
  ↓
System sends OTP via SMS
  ↓
User enters 6-digit OTP
  ↓
System verifies OTP
  ↓
User logged in, session created
```

#### Implementation Details

**Login Page**: `/login`
- Step 1: Phone number input with validation
- Step 2: OTP input (6 digits)
- Mock: Any 6-digit code works for demo
- Redirects to intended page after login

**Phone Number Validation**:
- Accepts: `+251911234567` or `0911234567`
- Validates Ethiopian format
- Normalizes to international format

### 2. Registration Flow

```
User enters: Name, Phone, Email (optional)
  ↓
System sends OTP to phone
  ↓
User enters OTP
  ↓
System verifies OTP
  ↓
Account created, user logged in
  ↓
Redirect to dashboard
```

#### Implementation Details

**Register Page**: `/register`
- Step 1: User details form
- Step 2: OTP verification
- Step 3: Success confirmation
- Auto-login after registration

### 3. Protected Routes

Routes that require authentication:
- `/dashboard` - Seller Dashboard
- `/dashboard/create` - Create Listing
- `/dashboard/edit/:id` - Edit Listing
- `/admin` - Admin Dashboard

**Protection Mechanism**:
```javascript
<Route path="dashboard" element={
  <ProtectedRoute>
    <SellerDashboard />
  </ProtectedRoute>
} />
```

If user is not authenticated:
1. Redirected to `/login`
2. Original URL saved in state
3. After login, redirected back to original URL

### 4. Authentication State

**Context**: `AuthContext.jsx`

```javascript
const { 
  user,              // Current user object
  isAuthenticated,   // Boolean: logged in or not
  login,             // Function: login user
  logout,            // Function: logout user
  register,          // Function: register new user
  updateUser         // Function: update user data
} = useAuth();
```

**User Object**:
```javascript
{
  id: string,           // Unique user ID
  name: string,         // Full name
  phone: string,        // Phone number
  email?: string,       // Email (optional)
  role: string,         // 'seller' or 'admin'
  joinedDate: string,   // ISO date string
  listingsCount: number,
  rating: number
}
```

**Persistence**:
- User data stored in `localStorage`
- Persists across page refreshes
- Cleared on logout

### 5. Header Navigation

**Not Authenticated**:
- Shows: Home, Login, Register
- Register button highlighted in green

**Authenticated**:
- Shows: Home, Dashboard, User Name, Logout
- User icon and name displayed
- Logout button clears session

### 6. API Endpoints

#### Send OTP
```javascript
POST /api/auth/otp
Body: { phoneNumber: string }
Response: { success: boolean, message: string }
```

#### Verify OTP
```javascript
POST /api/auth/verify-otp
Body: { phoneNumber: string, otp: string }
Response: { success: boolean, token: string }
```

#### Register User
```javascript
POST /api/auth/register
Body: { name: string, phone: string, email?: string }
Response: { success: boolean, data: User }
```

### 7. Mock Implementation

**Current Behavior** (for demo):
- Any 6-digit OTP is accepted
- No actual SMS sent
- Console logs OTP for testing
- Instant verification

**For Production**:
Replace mock functions in `src/api/mockApi.js` with real API calls to:
- SMS provider (Twilio, AfricasTalking, etc.)
- Backend authentication service
- Token management system

### 8. Security Considerations

**Current** (Demo):
- ⚠️ No actual OTP generation
- ⚠️ No rate limiting
- ⚠️ No token expiration
- ✅ Phone validation
- ✅ Session persistence

**Production Recommendations**:
1. **Backend OTP Generation**: Generate random 6-digit codes
2. **SMS Provider**: Integrate with Twilio, AfricasTalking, or local SMS gateway
3. **Rate Limiting**: Limit OTP requests (e.g., 1 per minute per phone)
4. **OTP Expiration**: 5-10 minute validity
5. **Token Management**: JWT with refresh tokens
6. **HTTPS Only**: Secure transmission
7. **Brute Force Protection**: Lock after failed attempts
8. **Phone Verification**: Verify phone ownership

## Testing Authentication

### Test Login

1. Go to `/login`
2. Enter any Ethiopian phone number:
   - `+251911234567` or
   - `0911234567`
3. Click "Send OTP"
4. Enter any 6-digit code (e.g., `123456`)
5. Click "Verify & Login"
6. You'll be logged in and redirected

### Test Registration

1. Go to `/register`
2. Fill in:
   - Name: `Test User`
   - Phone: `+251922334455`
   - Email: `test@example.com` (optional)
3. Click "Continue"
4. Enter any 6-digit OTP
5. Click "Verify & Create Account"
6. Account created, auto-logged in

### Test Protected Routes

1. Visit `/dashboard` without logging in
2. You'll be redirected to `/login`
3. After login, you'll return to `/dashboard`

### Test Logout

1. Click "Logout" in header
2. Session cleared
3. Redirected to home page
4. Try accessing `/dashboard` - redirected to login

## Customization

### Change OTP Length

Edit `Login.jsx` and `Register.jsx`:
```javascript
// Change from 6 to 4 digits
pattern: {
  value: /^\d{4}$/,
  message: 'OTP must be 4 digits'
}
```

### Add Email Authentication

1. Create `LoginWithEmail.jsx`
2. Add route in `App.jsx`
3. Implement email/password in API
4. Update AuthContext

### Add Social Login

1. Install `react-google-login` or similar
2. Add social login buttons to Login page
3. Implement OAuth flow in backend
4. Update login function in AuthContext

### Add Two-Factor Authentication

1. Add 2FA toggle in user settings
2. Generate TOTP secrets
3. Show QR code for authenticator apps
4. Verify TOTP on login

## Ethiopian SMS Providers

Popular SMS providers for Ethiopia:

1. **AfricasTalking** - Pan-African SMS gateway
2. **Twilio** - Global provider with Ethiopia support
3. **Local Telecom** - Ethio Telecom SMS API
4. **Infobip** - Enterprise SMS platform

## Integration Example

```javascript
// Example with AfricasTalking
import AfricasTalking from 'africastalking';

const AT = AfricasTalking({
  apiKey: process.env.AT_API_KEY,
  username: process.env.AT_USERNAME
});

export const sendOTP = async (phoneNumber) => {
  const otp = generateOTP(); // Generate 6-digit code
  
  // Store OTP in database with expiration
  await storeOTP(phoneNumber, otp);
  
  // Send SMS
  const result = await AT.SMS.send({
    to: [phoneNumber],
    message: `Your Ethiopia Market verification code is: ${otp}`,
    from: 'EthMarket'
  });
  
  return { success: true };
};
```

## Troubleshooting

### "Invalid phone number" error
- Check format: +251 or 09 prefix
- Ensure 10 digits for 09 format
- Ensure 12 digits for +251 format

### "Invalid OTP" error (in production)
- Check OTP hasn't expired
- Verify phone number matches
- Ensure OTP was sent successfully

### Session not persisting
- Check browser localStorage
- Clear browser cache
- Check AuthContext is wrapping App

### Protected route not working
- Verify ProtectedRoute component
- Check isAuthenticated state
- Ensure AuthProvider is mounted

## Best Practices

1. **Never log OTPs** in production
2. **Rate limit** OTP requests
3. **Monitor** failed authentication attempts
4. **Use HTTPS** in production
5. **Validate** phone numbers on backend too
6. **Store** minimal user data
7. **Encrypt** sensitive data
8. **Implement** session timeout
9. **Log** authentication events
10. **Test** on real devices with Ethiopian numbers

---

Built for Ethiopia 🇪🇹


# 🔐 How to Make Your Account an Admin

## The Problem

You're seeing this error:
```
User role 'seller' is not authorized to access this route
```

This happens because:
- You're logged in as a regular user (role: `seller`)
- Admin dashboard requires admin privileges (role: `admin`)

## ✅ Solution: Make Your Account an Admin

I've created two scripts to help you. Choose one:

---

## 🚀 **Option 1: Make First User Admin** (EASIEST)

This makes the oldest user in your database an admin (probably you).

### Steps:

1. **Open a new terminal/command prompt**

2. **Navigate to backend folder:**
   ```bash
   cd C:\Users\user\Desktop\cursor-roject\backend
   ```

3. **Run the script:**
   ```bash
   node make-first-user-admin.js
   ```

4. **You should see:**
   ```
   ✓ MongoDB Connected
   
   Found first user:
     Name: Your Name
     Email: your@email.com
     Current Role: seller
   
   ✅ SUCCESS! User is now an admin!
     Name: Your Name
     Email: your@email.com
     New Role: admin
   
   📝 IMPORTANT NEXT STEPS:
     1. Logout from the application
     2. Login again with this email: your@email.com
     3. Go to: http://localhost:3000/admin/yonatan321secure
     4. You should now have admin access!
   ```

5. **Follow the instructions:**
   - Logout from the application
   - Login again
   - Go to admin dashboard

---

## 📧 **Option 2: Make Specific User Admin** (If you know your email)

### Steps:

1. **Open a new terminal/command prompt**

2. **Navigate to backend folder:**
   ```bash
   cd C:\Users\user\Desktop\cursor-roject\backend
   ```

3. **Run the script with your email:**
   ```bash
   node make-admin.js your@email.com
   ```
   Replace `your@email.com` with your actual email

4. **Logout and login again**

---

## 🛠️ **Option 3: Manual Database Update** (Advanced)

If the scripts don't work, update directly in MongoDB:

### Using MongoDB Compass (GUI):

1. Open MongoDB Compass
2. Connect to your database
3. Go to the `users` collection
4. Find your user document
5. Edit the `role` field: change `"seller"` to `"admin"`
6. Save
7. Logout and login again

### Using MongoDB Shell:

```javascript
// Connect to your database
mongosh

// Use your database
use ethiopiamarket

// Find your user
db.users.find({email: "your@email.com"})

// Update role to admin
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "admin" } }
)

// Verify the change
db.users.find({email: "your@email.com"}, {name: 1, email: 1, role: 1})
```

---

## 🔄 After Making User Admin

### Step 1: Logout
- Click your profile/name in the header
- Click "Logout"
- Or clear localStorage:
  ```javascript
  // In browser console (F12):
  localStorage.clear();
  location.reload();
  ```

### Step 2: Login Again
- Login with the same email and password
- This generates a NEW token with admin role

### Step 3: Access Admin Dashboard
- Navigate to: `http://localhost:3000/admin/yonatan321secure`
- You should now see the admin dashboard!

---

## ✅ Verification

### Check if you're an admin:

**In browser console (F12):**
```javascript
const user = JSON.parse(localStorage.getItem('user'));
console.log('User role:', user.role);
```

**Should show:** `User role: admin`

If it still shows `seller`, you need to logout and login again!

---

## 🐛 Troubleshooting

### Script Error: "Cannot connect to MongoDB"

**Fix:**
1. Make sure MongoDB is running
2. Check `.env` file has correct `MONGO_URI`
3. Windows: Check MongoDB service is running
   ```bash
   sc query MongoDB
   ```

### Script Error: "User not found"

**Fix:**
1. Check the email is correct (check for typos)
2. Make sure user is registered
3. Try Option 1 (make first user admin) instead

### Still Getting 403 Error After Making Admin

**Possible causes:**
1. **Didn't logout/login again**
   - Solution: Logout completely and login again

2. **Old token still in localStorage**
   - Solution: Clear localStorage and login again
   ```javascript
   localStorage.clear();
   location.reload();
   ```

3. **Database didn't update**
   - Solution: Check database directly
   ```javascript
   // In MongoDB
   db.users.find({}, {name: 1, email: 1, role: 1})
   ```

### Backend Still Shows "seller" in Error

**This means:**
- Token wasn't refreshed
- Need to get a NEW token by logging in again

**Fix:**
1. Clear all browser data for localhost:3000
2. Close all tabs
3. Open fresh tab
4. Login again
5. Try admin dashboard

---

## 📝 Quick Command Reference

### Check Your MongoDB Connection:
```bash
mongosh
show dbs
use ethiopiamarket
db.users.find().pretty()
```

### View All Users and Their Roles:
```javascript
db.users.find({}, {name: 1, email: 1, role: 1}).pretty()
```

### Make Multiple Users Admin:
```javascript
// In MongoDB shell
db.users.updateMany(
  { email: { $in: ["user1@email.com", "user2@email.com"] } },
  { $set: { role: "admin" } }
)
```

### Reset a User Back to Seller:
```javascript
db.users.updateOne(
  { email: "user@email.com" },
  { $set: { role: "seller" } }
)
```

---

## 🎯 Complete Step-by-Step Example

Let's say your email is `test@example.com`:

```bash
# Step 1: Open terminal in backend folder
cd C:\Users\user\Desktop\cursor-roject\backend

# Step 2: Run script
node make-admin.js test@example.com

# You should see success message

# Step 3: Go to browser
# - Logout from the app
# - Or press F12 and run: localStorage.clear(); location.reload();

# Step 4: Login again with test@example.com

# Step 5: Navigate to admin dashboard
# http://localhost:3000/admin/yonatan321secure

# Step 6: SUCCESS! You should see admin dashboard
```

---

## 💡 Understanding JWT Tokens

**Why do you need to logout/login?**

When you login, the server creates a JWT token that includes your role:
```javascript
{
  id: "user123",
  role: "seller",  // ← This is baked into the token!
  exp: 1234567890
}
```

Even if you change your role in the database to `admin`, your current token still says `seller`.

**Solution:** Login again to get a NEW token with `role: "admin"`

---

## 🆘 Still Having Issues?

### Collect this information:

1. **Run the make-admin script and copy the output**

2. **Check database:**
   ```javascript
   // In MongoDB
   db.users.find({}, {name: 1, email: 1, role: 1}).pretty()
   ```
   Copy the results

3. **Check your token:**
   ```javascript
   // In browser console
   const user = JSON.parse(localStorage.getItem('user'));
   console.log('User:', user);
   console.log('Token:', user.token);
   
   // Decode token (just to view, not validate)
   const base64Url = user.token.split('.')[1];
   const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
   const payload = JSON.parse(atob(base64));
   console.log('Token Payload:', payload);
   ```
   Copy the payload - should show `role: "admin"`

4. **Check backend logs** when accessing admin route

---

## ✅ Success Indicators

You'll know it worked when:

1. ✅ Script shows: "SUCCESS! User is now an admin!"
2. ✅ After logout/login, browser console shows: `role: "admin"`
3. ✅ Can access `/admin/yonatan321secure` without 403 error
4. ✅ See admin dashboard with stats and pending listings
5. ✅ No errors in backend console

---

## 🔒 Security Notes

**For Production:**
- Don't use scripts to make users admin
- Create admin users through secure process
- Use environment variables for first admin
- Implement proper role management UI
- Log all role changes

**For Development:**
- This script is fine for local testing
- Remember to restrict admin access in production
- Consider adding admin invite system

---

**Ready to become an admin? Run the script now!** 🚀

```bash
cd backend
node make-first-user-admin.js
```


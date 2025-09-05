# Firebase Setup Guide for Acero Steel Website

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `acero-steel-website` (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create project"

## 2. Enable Firestore Database

1. In your Firebase project, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location for your database
5. Click "Done"

## 3. Get Firebase Configuration

1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps" section
3. Click "Add app" and select Web (</>) icon
4. Register your app with a nickname
5. Copy the Firebase configuration object

## 4. Set Up Environment Variables

Create a `.env` file in your project root with the following variables:

```env
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id
```

Replace the values with your actual Firebase config values.

## 5. Set Up Firestore Security Rules

In the Firestore Database section, go to "Rules" and update with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Orders collection - allow read/write for authenticated users
    match /orders/{orderId} {
      allow read, write: if request.auth != null;
      // For public access (remove auth requirement):
      // allow read, write: if true;
    }
    
    // Products collection - allow read for everyone, write for authenticated users
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 6. Database Structure

### Orders Collection
```javascript
{
  customerName: string,
  customerEmail: string,
  customerPhone: string,
  subject: string,
  message: string,
  items: [
    {
      id: string,
      name: string,
      image: string,
      category: string,
      specifications: string,
      retailPrice: string,
      wholesalePrice: string,
      quantity: number,
      priceType: 'retail' | 'wholesale'
    }
  ],
  totalAmount: number,
  status: 'pending' | 'processing' | 'completed' | 'cancelled',
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Products Collection
```javascript
{
  name: string,
  image: string,
  retailPrice: string,
  wholesalePrice: string,
  specifications: string,
  category: string,
  description: string,
  inStock: boolean,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## 7. Testing the Setup

1. Start your development server: `npm run dev`
2. Add items to cart
3. Fill out the contact form
4. Submit the order
5. Check Firestore Database to see if the order was created

## 8. Production Considerations

### Security Rules for Production
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Orders - only allow creation, not reading
    match /orders/{orderId} {
      allow create: if true;
      allow read, update, delete: if false;
    }
    
    // Products - read only for public
    match /products/{productId} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

### Environment Variables
- Never commit your `.env` file to version control
- Use different Firebase projects for development and production
- Set up proper environment variables in your hosting platform

## 9. Optional: Firebase Authentication

If you want to add admin authentication:

1. Go to "Authentication" in Firebase Console
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" provider
5. Update security rules to require authentication

## 10. Monitoring and Analytics

- Enable Firebase Analytics for usage insights
- Set up Firebase Performance Monitoring
- Configure Firebase Crashlytics for error tracking

## Troubleshooting

### Common Issues:
1. **CORS errors**: Make sure your domain is added to Firebase authorized domains
2. **Permission denied**: Check your Firestore security rules
3. **Environment variables not loading**: Ensure `.env` file is in project root and variables start with `VITE_`
4. **Network errors**: Check your Firebase configuration values

### Support:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

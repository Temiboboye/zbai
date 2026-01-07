#!/bin/bash

echo "🚀 Installing Payment Integration Dependencies..."
echo ""

# Frontend dependencies
echo "📦 Installing frontend packages..."
npm install stripe @stripe/stripe-js

echo ""
echo "✅ Payment dependencies installed successfully!"
echo ""
echo "📝 Next steps:"
echo "1. Get Stripe API keys from: https://dashboard.stripe.com/apikeys"
echo "2. Get Cryptomus API keys from: https://app.cryptomus.com/settings/api"
echo "3. Add keys to .env.local:"
echo "   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_..."
echo "   STRIPE_SECRET_KEY=sk_test_..."
echo "   STRIPE_WEBHOOK_SECRET=whsec_..."
echo "   CRYPTOMUS_API_KEY=..."
echo "   CRYPTOMUS_MERCHANT_ID=..."
echo ""
echo "4. Test the billing page at: http://localhost:3000/billing"
echo ""

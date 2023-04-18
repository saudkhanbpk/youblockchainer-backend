# Web3 ChatGPT Backend

###### LINKS

- [Backend Server]()

###### SYMBOLS

- 📝 PENDING
- ✔️ FINISHED
- ⚠️ NOT FOR APP (ADMIN ONLY)
- 🟢 GET
- 🟠 POST
- 🟡 PUT
- 🔴 DELETE

## Schemas

### User
  
```js
{
  _id: user_id,
  walletAddress: String,
  favorites: [
    offer_id
  ],
  favoriteItems: [
    item_id
  ],
  redeemed: [
    offer_id
  ],
  claimed: [
    offer_id
  ],
  created: [
    offer_id
  ],
  username: String,
  bio: String,
  email: String,
  profileImage: String, // IPFS string
  profileBanner: String, // IPFS string
  email: String,
  socialHandles: [
    {
      name: String, // Eg. Twitter
      link: String, // Eg. twitterHandleLink
    }
  ],
  followers: [
    user_id
  ],
  following: [
    user_id
  ],
  isVerifiedCreator: Boolean,
  isAdmin: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```
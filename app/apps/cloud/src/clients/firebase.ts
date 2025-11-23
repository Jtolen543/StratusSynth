import { initializeApp } from "firebase-admin"
const admin = require("firebase-admin")

export const adminCloudClient = admin.initializeApp({
    credential: admin.credential.applicationDefault()
}) as ReturnType<typeof initializeApp>
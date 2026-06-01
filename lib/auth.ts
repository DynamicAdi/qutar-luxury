import { JWTPayload, SignJWT, jwtVerify } from "jose";
import {cookies} from "next/headers";
const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "supersecret"
);

export async function signToken(payload: JWTPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1d")
    .sign(secret);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (err) {
    const cookiesControl = await cookies();
    cookiesControl.delete("token");
    return null;
  }
}

export async function getUser(): Promise<JWTPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return null;

    const payload = await verifyToken(token);
    return payload;
  } catch {
    return null;
  }
}
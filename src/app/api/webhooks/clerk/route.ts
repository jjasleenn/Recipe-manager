import { Webhook } from "svix";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

type ClerkEvent = {
  type: string;
  data: any;
};

export async function POST(req: Request) {
  try {
    const body = await req.text();

    const headerList = await headers();

    const svix_id = headerList.get("svix-id");
    const svix_timestamp = headerList.get("svix-timestamp");
    const svix_signature = headerList.get("svix-signature");

    if (!svix_id || !svix_timestamp || !svix_signature) {
      return new Response("Missing svix headers", { status: 400 });
    }

    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);


    const event = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as ClerkEvent;


    if (event.type === "user.created") {
      const user = event.data;

      await prisma.user.create({
        data: {
          id: user.id,
          email: user.email_addresses?.[0]?.email_address ?? "",
          name: `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim(),
        },
      });
    }

    return new Response("OK", { status: 200 });
  } catch (err) {
    console.error("Webhook error:", err);
    return new Response("Webhook error", { status: 500 });
  }
}
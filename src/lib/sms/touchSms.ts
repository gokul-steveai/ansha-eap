"use server";

export type SendSMS = {
  to: string;      // recipient AU number, e.g. "61438011762"
  body: string;    // SMS content
};

export const sendSms = async ({ to, body }: SendSMS) => {
  const result = {
    success: false,
    message: "",
    data: null as string | null,
  };

  const username = process.env.TOUCHSMS_USERNAME || "";
  const password = process.env.TOUCHSMS_PASSWORD || "";
  const sender = process.env.TOUCHSMS_SENDER || "";

  if (!username || !password || !sender) {
    result.message = "Missing touchSMS credentials or sender number";
    return result;
  }

  const url = "https://app.touchsms.com.au/api/v2/sms";

  const payload = {
    reject_duplicates_by_recipient: false,
    messages: [
      {
        to,
        from: sender,
        body,
      },
    ],
  };

  // touchSMS uses Basic Auth with username/password
  const authHeader = "Basic " + Buffer.from(`${username}:${password}`).toString("base64");

  const options = {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": authHeader,
    },
    body: JSON.stringify(payload),
  };

  try {
    const res = await fetch(url, options);
    const resJson = await res.json();

    result.success = res.ok;
    result.message = res.ok ? "SMS sent successfully" : resJson.error || "Failed to send SMS";
    result.data = JSON.stringify(resJson);
    return result;
  } catch (error) {
    result.message = `${error}`;
    return result;
  }
};

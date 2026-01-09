import { SAML, ValidateInResponseTo } from "@node-saml/node-saml";
import { env } from "@ryankshaw/next-runtime-env";

const formatCert = (cert: string | undefined) => {
  if (!cert) return "";

  if (cert.includes("-----BEGIN CERTIFICATE-----")) {
    return cert.replace(/\\n/g, "\n");
  }

  const chunked = cert.match(/.{1,64}/g)?.join("\n");

  return `-----BEGIN CERTIFICATE-----\n${chunked}\n-----END CERTIFICATE-----`;
};

export const samlStrategy = new SAML({
  callbackUrl: `${env("NEXT_PUBLIC_APP_URL") ?? "http://localhost:3000"}/api/auth/saml/callback`,
  entryPoint: process.env.SAML_ENTRY_POINT,
  idpCert: formatCert(process.env.SAML_CERT ?? ""),
  issuer: "isim-website",
  wantAssertionsSigned: true,
  wantAuthnResponseSigned: false,
  audience: false,
  acceptedClockSkewMs: 30000,
  authnRequestBinding: "HTTP-Redirect",
});

export interface PropertyProposalPromptProps {
  propertyTitle: string;
  propertyType: string;
  propertyAddress: string;
  propertyPrice: string | number;
  clientName: string;
  clientEmail: string;
  pdfUrl: string;
}

export function getPrompt({
  propertyTitle,
  propertyType,
  propertyAddress,
  propertyPrice,
  clientName,
  clientEmail,
}: PropertyProposalPromptProps) {
  return `
You are a professional real estate sales assistant.

Generate a premium and persuasive PROPERTY PROPOSAL EMAIL.

Property Details:
- Property Name: ${propertyTitle}
- Property Type: ${propertyType}
- Location: ${propertyAddress}
- Price: ${propertyPrice}

Client Details:
- Client Name: ${clientName}
- Client Email: ${clientEmail}

IMPORTANT INSTRUCTIONS:
- Return ONLY valid JSON
- Do NOT return markdown
- Do NOT wrap response inside \`\`\`
- Do NOT include explanations
- Response must strictly follow this structure:

{
  "subject": "string",
  "body": "string"
}

BODY INSTRUCTIONS:
- Write a professional greeting
- Make the tone premium, persuasive, and formal
- Mention the property name naturally
- Highlight value proposition and investment opportunity
- Mention that the attached proposal PDF contains complete details
- Keep the body concise but engaging
- Body should be plain text only
`;
}

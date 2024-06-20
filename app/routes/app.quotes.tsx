import { useState } from "react";
import { json, redirect, ActionFunction, LoaderFunction } from "@remix-run/node";
import {
  useLoaderData,
  useActionData,
  useSubmit,
  useNavigate,
  Form,
} from "@remix-run/react";
import { authenticate } from "../shopify.server";
import {
  Page,
  Layout,
  Card,
  DataTable,
  Button,
  TextField,
  FormLayout,
  InlineStack,
} from "@shopify/polaris";
import { createQuote, getQuotes, validateQuote } from "../models/Quote.server";

// Define the types for your data
interface Quote {
  id: string;
  createdAt: string;
  updatedAt: string;
  shopId: string;
  productId: string;
  variantId: string;
  title: string;
  image?: string;
  metadata?: string;
  message?: string;
  status: string;
}

interface LoaderData {
  quotes: Quote[];
}

interface ActionData {
  errors?: Record<string, string>;
}

// Loader to fetch quotes
export const loader: LoaderFunction = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const { session } = await authenticate.admin(request);
  const { shop } = session;
  const shopId = shop; // Assuming shop ID is available in the admin object
  const quotes = await getQuotes(shopId);
  console.log(quotes);
  console.log("LOADER");
  return { quotes };
};

// Action to handle form submissions
export const action: ActionFunction = async ({ request }) => {
    const { admin } = await authenticate.admin(request);
    const { session } = await authenticate.admin(request);
    const { shop } = session;
    const shopId = shop;

  const formData = await request.formData();
  console.log(formData);
  const data: {
    title: string;
    productId: string;
    variantId: string;
    image?: string;
    metadata?: string;
    message?: string;
  } = Object.fromEntries(Array.from(formData.entries())) as {
    title: string;
    productId: string;
    variantId: string;
    image?: string;
    metadata?: string;
    message?: string;
  };
  const errors = validateQuote(data);

  if (errors) {
    return json<ActionData>({ errors }, { status: 422 });
  }

  await createQuote({shopId, ...data});
  return redirect("/app/quotes");
};

export default function QuotesPage() {
  const { quotes } = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();
  const navigate = useNavigate();
  const submit = useSubmit();

  const [formState, setFormState] = useState({
    title: "",
    productId: "",
    variantId: "",
    image: "",
    metadata: "",
    message: "",
  });

  const handleFormChange = (field: keyof typeof formState) => (value: string) => {
    setFormState((prevState) => ({ ...prevState, [field]: value }));
  };

  const handleSave = () => {
    submit(formState, { method: "post" });
  };

  const rows = quotes.map((quote: Quote) => [
    quote.title,
    quote.productId,
    quote.variantId,
    quote.message,
    quote.status,
  ]);

  return (
    <Page title="Quotes">
      <Layout>
        <Layout.Section>
          <Card>
            <DataTable
              columnContentTypes={["text", "text", "text", "text", "text"]}
              headings={["Title", "Product ID", "Variant ID", "Message", "Status"]}
              rows={rows}
            />
          </Card>
        </Layout.Section>
        <Layout.Section>
          <Card>
            <Form method="post">
              <FormLayout>
                <TextField
                  label="Title"
                  name="title"
                  type="text"
                  value={formState.title}
                  onChange={handleFormChange("title")}
                  autoComplete="off"
                  error={actionData?.errors?.title}
                />
                <TextField
                  label="Product ID"
                  name="productId"
                  type="text"
                  value={formState.productId}
                  onChange={handleFormChange("productId")}
                  autoComplete="off"
                  error={actionData?.errors?.productId}
                />
                <TextField
                  label="Variant ID"
                  name="variantId"
                  type="text"
                  value={formState.variantId}
                  onChange={handleFormChange("variantId")}
                  autoComplete="off"
                  error={actionData?.errors?.variantId}
                />
                <TextField
                  label="Image URL"
                  name="image"
                  type="url"
                  value={formState.image}
                  onChange={handleFormChange("image")}
                  autoComplete="off"
                />
                <TextField
                  label="Metadata"
                  name="metadata"
                  type="text"
                  value={formState.metadata}
                  onChange={handleFormChange("metadata")}
                  autoComplete="off"
                />
                <TextField
                  label="Message"
                  name="message"
                  type="text"
                  value={formState.message}
                  onChange={handleFormChange("message")}
                  autoComplete="off"
                />
                <InlineStack>
                  <Button onClick={handleSave}>
                    Add Quote
                  </Button>
                </InlineStack>
              </FormLayout>
            </Form>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

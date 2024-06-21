import { useState, useCallback, useEffect } from "react";
import { json, redirect, ActionFunction, LoaderFunction } from "@remix-run/node";
import {
  useLoaderData,
  useActionData,
  useSubmit,
  Form,
} from "@remix-run/react";
import { authenticate } from "../shopify.server";
import {
  Page,
  Layout,
  Card,
  ResourceList,
  Button,
  TextField,
  FormLayout,
  InlineStack,
  Modal,
  EmptyState,
  Thumbnail,
  Text,
} from "@shopify/polaris";
import { createQuote, getQuotes, validateQuote, deleteQuote } from "../models/Quote.server";

// Define the types for your data
interface Quote {
  id: string;
  createdAt: string;
  updatedAt: string;
  shopId: string;
  productId: string;
  variantId: string;
  title: string;
  name: string;
  email: string;
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
  const { session } = await authenticate.admin(request);
  const { shop } = session;
  const shopId = shop;
  const quotes = await getQuotes(shopId);
  return json({
    quotes,
    shop,
  });
};

// Action to handle form submissions
export const action: ActionFunction = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const { shop } = session;
  const shopId = shop;

  const formData = await request.formData();
  const data: {
    title: string;
    productId: string;
    variantId: string;
    name: string;
    email: string;
    image?: string;
    metadata?: string;
    message?: string;
  } = Object.fromEntries(formData.entries()) as {
    title: string;
    productId: string;
    variantId: string;
    name: string;
    email: string;
    image?: string;
    metadata?: string;
    message?: string;
  };
  const errors = validateQuote(data);

  if (errors) {
    return json<ActionData>({ errors }, { status: 422 });
  }

  const { title, ...rest } = data;
  const updatedData = {
    shopId,
    title: title || "",
    ...rest,
  };

  await createQuote(updatedData);
  return redirect("/app/quotes");
};


export default function QuotesPage() {
  const actionData = useActionData<ActionData>();
  const submit = useSubmit();
  const { quotes } = useLoaderData<LoaderData>();

  const [quotesData, setQuotesData] = useState(quotes);
  const [formState, setFormState] = useState({
    productId: "",
    variantId: "",
    image: "",
    metadata: "",
    message: "",
    title: "",
    productHandle: "",
    productAlt: "",
    name: "",
    email: "",
  });

  useEffect(() => {
    setQuotesData(quotes);
  }, [quotes]);

  const [modalActive, setModalActive] = useState(false);

  const handleFormChange = (field: keyof typeof formState) => (value: string) => {
    setFormState((prevState) => ({ ...prevState, [field]: value }));
  };
  
  const handleSave = () => {
    toggleModal();
    submit(formState, { method: "post" });
  };
  
  const selectProduct = async () => {
    const products = await window.shopify.resourcePicker({
      type: "product",
      action: "select",
    });

    if (products) {
      const { images, id, variants, title, handle } = products[0];

      setFormState({
        ...formState,
        productId: id,
        variantId: variants[0].id ? variants[0].id : "",
        title: title,
        productHandle: handle,
        productAlt: images[0]?.altText ? images[0]?.altText : "",
        image: images[0]?.originalSrc,
      });
    }
  };

  const toggleModal = useCallback(() => setModalActive((active) => !active), []);
  
  const fetchQuotes = async () => {
    const response = await fetch("/quotes");
    const data = await response.json();
    console.log(data)
    setQuotesData(data.quotes);
  };

  const handleDelete = async (id: string) => {
    await fetch(`/quotes/delete`, {
      method: "POST",
      body: JSON.stringify({ id }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    await fetchQuotes();
  };

  const resourceName = {
    singular: 'quote',
    plural: 'quotes',
  };

  const items = quotesData.map((quote) => ({
    id: quote.id,
    url: '#',
    media: <Thumbnail source={quote.image || ""} alt="Product Image" />,
    attributeOne: quote.title,
    attributeTwo: quote.name,
    attributeThree: quote.email,
    attributeFour: quote.message,
    actions: [
      {
        content: 'Delete',
        destructive: true,
        onAction: () => handleDelete(quote.id),
      },
    ],
  }));

  return (
    <Page title="Quotes">
      <Layout>
        <Layout.Section>
          <Card>
            {quotesData.length > 0 ? (
              <>
                <ResourceList
                  resourceName={resourceName}
                  items={items}
                  renderItem={(item) => {
                    const { id, url, media, attributeOne, attributeTwo, attributeThree, attributeFour, actions } = item;
                    return (
                      <ResourceList.Item
                        id={id}
                        url={url}
                        media={media}
                        accessibilityLabel={`View details for ${attributeOne}`}
                        shortcutActions={actions}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ flex: 1 }}>
                            <h3>
                              <Text variant="bodyMd" fontWeight="bold" as="span">
                                {attributeOne}
                              </Text>
                            </h3>
                            <div>{attributeTwo}</div>
                            <div>{attributeThree}</div>
                            <div>{attributeFour}</div>
                          </div>
                        </div>
                      </ResourceList.Item>
                    );
                  }}
                />
                <InlineStack>
                  <Button variant="primary" onClick={toggleModal}>
                    Add Quote
                  </Button>
                </InlineStack>
              </>
            ) : (
              <EmptyState
                heading="No quotes yet"
                action={{ content: "Add Quote", onAction: toggleModal }}
                image="https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg"
              >
                <p>Create your first quote to get started, or add the rfq app block to your storefront</p>
              </EmptyState>
            )}
          </Card>
        </Layout.Section>
      </Layout>

      <Modal
        open={modalActive}
        onClose={toggleModal}
        title="Add a New Quote"
        primaryAction={{ content: "Save", onAction: handleSave }}
        secondaryActions={[{ content: "Cancel", onAction: toggleModal }]}
      >
        <Modal.Section>
          <Form method="post">
            <FormLayout>
              <p>Select a product to add a quote for</p>
              <Button onClick={selectProduct}>Select Product</Button>
              {formState.productId && (
                <InlineStack gap="500" blockAlign="center">
                  <Thumbnail source={formState.image || ""} alt="Product Image" />
                  <Text as="span" variant="headingMd" fontWeight="semibold">
                    {formState.title}
                  </Text>
                </InlineStack>
              )}
              <TextField
                label="Name"
                name="name"
                type="text"
                value={formState.name}
                onChange={handleFormChange("name")}
                autoComplete="off"
                error={actionData?.errors?.name}
              />
              <TextField
                label="Email"
                name="email"
                type="email"
                value={formState.email}
                onChange={handleFormChange("email")}
                autoComplete="off"
                error={actionData?.errors?.email}
              />
              <TextField
                label="Message"
                name="message"
                type="text"
                value={formState.message}
                onChange={handleFormChange("message")}
                autoComplete="off"
                error={actionData?.errors?.message}
              />
            </FormLayout>
          </Form>
        </Modal.Section>
      </Modal>
      <p>add an app block to your product page in the storefront customizer to test the quote contact form!</p>
    </Page>
  );
}

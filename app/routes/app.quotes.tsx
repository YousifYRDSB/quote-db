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


/**
 * Quote interface representing the structure of a quote object.
 */
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

/**
 * LoaderData interface representing the data returned by the loader.
 */
interface LoaderData {
  quotes: Quote[];
}

/**
 * ActionData interface representing the data returned by the action.
 */
interface ActionData {
  errors?: Record<string, string>;
}

/**
 * Loader function to fetch quotes from the database.
 * This function is called when the page loads.
 * @param request - The incoming request object.
 * @returns A JSON response containing the quotes and shop information.
 */
export const loader: LoaderFunction = async ({ request }) => {
  const { session } = await authenticate.admin(request); // Authenticate the admin
  const { shop } = session;
  const shopId = shop;
  const quotes = await getQuotes(shopId); // Fetch quotes from the database
  return json({
    quotes,
    shop,
  });
};

/**
 * Action function to handle form submissions.
 * This function validates the quote data and creates a new quote if validation succeeds.
 * This function is called when the form is submitted.
 * @param request - The incoming request object.
 * @returns A redirect response to the quotes page.
 */
export const action: ActionFunction = async ({ request }) => {
  const { session } = await authenticate.admin(request); // Authenticate the admin
  const { shop } = session;
  const shopId = shop;

  const formData = await request.formData(); // Get form data from the request
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
  const errors = validateQuote(data); // Validate the quote data

  if (errors) {
    return json<ActionData>({ errors }, { status: 422 }); // Return errors if validation fails
  }

  const { title, ...rest } = data;
  const updatedData = {
    shopId,
    title: title || "",
    ...rest,
  };

  await createQuote(updatedData); // Create a new quote in the database
  return redirect("/app/quotes"); // refresh the page to update the quotes list
};

/**
 * Main component for the Quotes page.
 * Displays a list of quotes and provides functionality to add, edit, and delete quotes.
 */
export default function QuotesPage() {
  const actionData = useActionData<ActionData>(); // Data returned by the action function
  const submit = useSubmit(); // Hook to submit form data
  const { quotes } = useLoaderData<LoaderData>(); // Data returned by the loader function

  // State to store the quotes data
  const [quotesData, setQuotesData] = useState(quotes);
  
  // State to store the form data
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

  // Update quotes data when new quotes are loaded
  useEffect(() => {
    setQuotesData(quotes);
  }, [quotes]);

  // State to manage the visibility of the modal
  const [modalActive, setModalActive] = useState(false);

  /**
   * Handles form field changes and updates the form state.
   * @param field - The form field being changed.
   * @returns A function that updates the form state.
   */
  const handleFormChange = (field: keyof typeof formState) => (value: string) => {
    setFormState((prevState) => ({ ...prevState, [field]: value }));
  };

  /**
   * Handles form submission to add a quote.
   * also toggles modal visibility; effectively closing the modal form
   */
  const handleSave = () => {
    toggleModal();
    submit(formState, { method: "post" });
  };

  /**
   * Opens the Shopify product picker to select a product.
   * Updates the form state with the selected product details.
   */
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

  /**
   * Toggles the visibility of the modal.
   */
  const toggleModal = useCallback(() => setModalActive((active) => !active), []);

  /**
   * Fetches the latest quotes from the server and updates the state.
   * uses custom server endpoint defined in routes/quotes.ts
   */
  const fetchQuotes = async () => {
    const response = await fetch("/quotes");
    const data = await response.json();
    console.log(data);
    setQuotesData(data.quotes);
  };

  /**
   * Handles deleting a quote.
   * Sends a delete request to the server and fetches the latest quotes.
   * uses custom server endpoint defined in routes/quotes/delete.ts
   * @param id - The ID of the quote to delete.
   */
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

  // Define the resource name for the ResourceList component
  const resourceName = {
    singular: 'quote',
    plural: 'quotes',
  };

  // Map quotes data to each individual attribute, to display in the quotes list
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

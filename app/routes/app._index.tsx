import { useEffect } from "react";
import { redirect, useNavigate, useNavigation } from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  Card,
  Button,
  BlockStack,
  Box,
  List,
  Link,
  InlineStack,
} from "@shopify/polaris";
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";

export default function Index() {

  const shopify = useAppBridge();

  //useeffect hook to display a welcome toast
  useEffect(() => {
    shopify.toast.show("Welcome to the Quote Management App!");
  }, [shopify]);

  const navigate = useNavigate()

  return (
    //index page with basic info
    <Page>
      <TitleBar title="Welcome to the Quote Management App" />
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="500">
                <BlockStack gap="200">
                  <Text as="h2" variant="headingMd">
                    Welcome to the Quote Management App 🎉
                  </Text>
                  <Text variant="bodyMd" as="p">
                    This app is designed to help you manage quotes effectively. You can create, view, and manage quotes seamlessly within your Shopify admin interface.
                  </Text>
                </BlockStack>
                <BlockStack gap="200">
                  <Text as="h3" variant="headingMd">
                    Tech Stack
                  </Text>
                  <List>
                    <List.Item>
                      <Link
                        url="https://remix.run"
                        target="_blank"
                        removeUnderline
                      >
                        Remix
                      </Link>{" "}
                      - The framework used for building this app.
                    </List.Item>
                    <List.Item>
                      <Link
                        url="https://www.prisma.io/"
                        target="_blank"
                        removeUnderline
                      >
                        Prisma
                      </Link>{" "}
                      - Used for database management.
                    </List.Item>
                    <List.Item>
                      <Link
                        url="https://polaris.shopify.com"
                        target="_blank"
                        removeUnderline
                      >
                        Polaris
                      </Link>{" "}
                      - For the app's UI components.
                    </List.Item>
                    <List.Item>
                      <Link
                        url="https://shopify.dev/docs/apps/tools/app-bridge"
                        target="_blank"
                        removeUnderline
                      >
                        App Bridge
                      </Link>{" "}
                      - For embedding the app into Shopify.
                    </List.Item>
                    <List.Item>
                      <Link
                        url="https://shopify.dev/docs/api/admin-graphql"
                        target="_blank"
                        removeUnderline
                      >
                        Shopify Admin GraphQL API
                      </Link>{" "}
                      - For interacting with Shopify's data.
                    </List.Item>
                  </List>
                </BlockStack>
                <BlockStack gap="200">
                  <Text as="h3" variant="headingMd">
                    Purpose of the App
                  </Text>
                  <Text as="p" variant="bodyMd">
                    The Quote Management App allows you to handle customer quotes efficiently. You can add a custom contact form to your storefront, enabling customers to request quotes directly. All submitted quotes are managed in the quotes page, making it easy to keep track of and respond to requests.
                  </Text>
                </BlockStack>
                <BlockStack gap="200">
                  <Text as="h3" variant="headingMd">
                    Instructions for Usage
                  </Text>
                  <List>
                    <List.Item>
                      <Text as="span" variant="bodyMd" fontWeight="bold">
                        Managing Quotes:
                      </Text>{" "}
                      Navigate to the Quotes page in the app to view, create, and manage quotes.
                    </List.Item>
                    <List.Item>
                      <Text as="span" variant="bodyMd" fontWeight="bold">
                        Adding the App Block:
                      </Text>{" "}
                      Add the "RFQ Contact Form" block to your Shopify storefront. This block allows customers to fill out a form to request a quote.
                    </List.Item>
                  </List>
                </BlockStack>
                <InlineStack gap="300">
                  <Button variant="primary" onClick={() => navigate("/app/quotes")}>
                    Go to Quotes Page
                  </Button>
                  <Button variant="plain" url="https://shopify.dev/docs/apps/getting-started/build-app-example" target="_blank">
                    Learn more
                  </Button>
                </InlineStack>
              </BlockStack>
            </Card>
          </Layout.Section>
          <Layout.Section variant="oneThird">
            <BlockStack gap="500">
              <Card>
                <BlockStack gap="200">
                  <Text as="h2" variant="headingMd">
                    Resources
                  </Text>
                  <List>
                    <List.Item>
                      <Link
                        url="https://remix.run/docs"
                        target="_blank"
                        removeUnderline
                      >
                        Remix Documentation
                      </Link>
                    </List.Item>
                    <List.Item>
                      <Link
                        url="https://www.prisma.io/docs"
                        target="_blank"
                        removeUnderline
                      >
                        Prisma Documentation
                      </Link>
                    </List.Item>
                    <List.Item>
                      <Link
                        url="https://polaris.shopify.com/documentation"
                        target="_blank"
                        removeUnderline
                      >
                        Polaris Documentation
                      </Link>
                    </List.Item>
                    <List.Item>
                      <Link
                        url="https://shopify.dev/docs/apps/tools/app-bridge"
                        target="_blank"
                        removeUnderline
                      >
                        App Bridge Documentation
                      </Link>
                    </List.Item>
                    <List.Item>
                      <Link
                        url="https://shopify.dev/docs/api/admin-graphql"
                        target="_blank"
                        removeUnderline
                      >
                        Shopify Admin GraphQL API Documentation
                      </Link>
                    </List.Item>
                  </List>
                </BlockStack>
              </Card>
             
            </BlockStack>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}

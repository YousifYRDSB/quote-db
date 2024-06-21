// NOT USED

// const PRODUCT_SEARCH_QUERY = `
//   query($query: String!) {
//     products(first: 10, query: $query) {
//       edges {
//         node {
//           id
//           title
//           images(first: 1) {
//             edges {
//               node {
//                 originalSrc
//               }
//             }
//           }
//           variants(first: 1) {
//             edges {
//               node {
//                 id
//                 title
//               }
//             }
//           }
//         }
//       }
//     }
//   }
// `;

// export async function searchProducts(shop: string, token: string, searchTerm: string) {
//   const response = await graphqlRequest({
//     shop,
//     accessToken: token,
//     query: PRODUCT_SEARCH_QUERY,
//     variables: {
//       query: searchTerm,
//     },
//   });

//   const products = response.data.products.edges.map((edge: any) => {
//     const product = edge.node;
//     return {
//       id: product.id,
//       title: product.title,
//       image: product.images.edges[0]?.node.originalSrc || "",
//       variants: product.variants.edges.map((variantEdge: any) => ({
//         id: variantEdge.node.id,
//         title: variantEdge.node.title,
//       })),
//     };
//   });

//   return products;
// }

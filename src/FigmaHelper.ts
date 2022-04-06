
const TOKEN = // Add generated user access token;

// Fetches a document by the document key
export const fetchFigmaFile = (key: string) => {
  return fetch(`https://api.figma.com/v1/files/${key}`, {
    headers: { "X-Figma-Token": TOKEN },
  }).then((response) => response.json());
};

// Fetch all styles used in a document
export const fetchFigmaStyles = (key: string) => {
  return fetch(`https://api.figma.com/v1/files/${key}/styles`, {
    headers: { "X-Figma-Token": TOKEN },
  }).then((response) => response.json());
};

// Fetches all froms from an array of node Ids
export const fetchFigmaNodes = (key: string, nodeIds: string[]) => {
  return fetch(`https://api.figma.com/v1/files/${key}/nodes?ids=${nodeIds}`, {
    headers: { "X-Figma-Token": TOKEN },
  }).then((response) => response.json());
};

// Fetches a specific component
export const fetchFigmaComponent = (key: string) => {
  return fetch(`https://api.figma.com/v1/components/${key}`, {
    headers: { "X-Figma-Token": TOKEN },
  }).then((response) => response.json());
};

// Fetches all components in a document
export const fetchFigmaComponents = (key: string) => {
  return fetch(`https://api.figma.com/v1/files/${key}/components`, {
    headers: { "X-Figma-Token": TOKEN },
  }).then((response) => response.json());
};

export const fetchFigmaComponentSets = (key: string) => {
  return fetch(`https://api.figma.com/v1/files/${key}/component_sets`, {
    headers: { "X-Figma-Token": TOKEN },
  }).then((response) => response.json());
};

// Get a list of all nodes associated with styles/tokens
export const getNodes = (styles: any) => {
  return styles.meta.styles
    .map((style: any) => {
      return style.node_id;
    })
    .join(",");
};

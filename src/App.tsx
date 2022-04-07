import React, { useEffect, useState } from "react";
import "./App.css";
import {
  fetchFigmaComponentSets,
  fetchFigmaNodes,
  fetchFigmaStyles,
  getNodes,
} from "./FigmaHelper";

export const TOKEN = ""; // User generated token
const PAGE_TOKEN = ""; // page id taken from the url
const PAGE_NAME = ""; // Name of design system for embed url

const Swatch = ({ color, name }: any) => (
  <div className="swatch">
    <div
      style={{
        width: "100%",
        height: 80,
        borderRadius: 8,
        marginBottom: 8,
        backgroundColor: color,
      }}
    />
    {name}
  </div>
);

function App() {
  const [tokens, updateTokens] = useState([]);
  const [components, updateComponents]: any[] = useState([]);
  const [selectedComponent, updateSelectedComponent]: any = useState();

  // Converts provided RGB to standard
  const toHex = (value: any) => Math.round(value * 255);
  const formatColor = ({ r: red, g: green, b: blue, a: alpha }: any) => {
    return alpha !== 1
      ? `rgba(${toHex(red)}, ${toHex(green)}, ${toHex(blue)}, ${toHex(alpha)})`
      : `rgb(${toHex(red)}, ${toHex(green)}, ${toHex(blue)})`;
  };

  useEffect(() => {
    const getTokens = async () => {
      // Get all figma "styles" - essentially tokens
      fetchFigmaStyles(PAGE_TOKEN)
        // Get all nodeId's associated with styles/tokens
        .then(getNodes)
        // Get all figma nodes from the nodeId array
        .then((results) => fetchFigmaNodes(PAGE_TOKEN, results))
        .then((results) => {
          let { nodes } = results;
          const arr: any = [];
          // Extract what we need from the metadata
          for (let node in nodes) {
            let vals = nodes[node].document;
            arr.push({
              id: vals.id,
              name: vals.name,
              color: formatColor(vals.fills[0].color),
            });
          }
          // Just a sort to make things more organized
          arr.sort((a: any, b: any) => {
            let fa = a.name.toLowerCase(),
              fb = b.name.toLowerCase();

            if (fa < fb) {
              return -1;
            }
            if (fa > fb) {
              return 1;
            }
            return 0;
          });
          updateTokens(arr);
        });
    };
    getTokens();
  }, []);

  useEffect(() => {
    const getComponents = async () => {
      // Get a list of all components
      fetchFigmaComponentSets(PAGE_TOKEN).then((results) => {
        // Grab what we need from metadata
        const componentSets = results.meta.component_sets.map(
          (component: any) => {
            return {
              name: component.name,
              thumbnail: component.thumbnail_url,
              id: component.node_id,
            };
          }
        );
        updateComponents(componentSets);
      });
    };
    getComponents();
  }, []);

  const handleChange = (e: any) => {
    // Change the selected component
    updateSelectedComponent(e.target.value);
  };

  return (
    <div>
      <div className="App">
        <h1>Tokens</h1>
        <p>Display a list of tokens and their color values:</p>
        <div className="grid">
          {tokens.map((token: any, i) => (
            <Swatch key={i} color={token.color} name={token.name} />
          ))}
        </div>
        <h1>Components</h1>
        <p>
          Grab a list of all components and use the NodeID and display the name,
          thumbnail, and embed the Figma frame of the component.
        </p>
        <div>
          <select onChange={(e) => handleChange(e)}>
            <option value={undefined}>Pick a Component</option>
            {components.map((component: any, i: number) => (
              <option value={i}>{component.name}</option>
            ))}
          </select>
          {selectedComponent && (
            <div>
              <h2>{components[selectedComponent].name}</h2>
              <img src={components[selectedComponent].thumbnail} alt="" />
              <iframe
                title="test"
                width="800"
                height="450"
                src={`https://www.figma.com/embed?embed_host=share&url=https://www.figma.com/file/${PAGE_TOKEN}/${PAGE_NAME}?node-id=${components[selectedComponent].nodeId}`}
              ></iframe>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

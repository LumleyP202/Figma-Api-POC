import React, { useEffect, useState } from "react";
import "./App.css";
import {
  fetchFigmaComponentSets,
  fetchFigmaNodes,
  fetchFigmaStyles,
  getNodes,
} from "./FigmaHelper";

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
  const [components, updateComponents] = useState([]);

  const pageToken = TOKEN;
  const embedUrl = EMBED_URL;

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
      fetchFigmaStyles(pageToken)
        // Get all nodeId's associated with styles/tokens
        .then(getNodes)
        // Get all figma nodes from the nodeId array
        .then((results) => fetchFigmaNodes(pageToken, results))
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
      fetchFigmaComponentSets(pageToken).then((results) => {
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

  return (
    <div>
      <h1>Embed</h1>
      <iframe title="test" width="800" height="450" src={embedUrl}></iframe>
      <div className="App">
        <h1>Tokens</h1>
        <div className="grid">
          {tokens.map((token: any, i) => (
            <Swatch key={i} color={token.color} name={token.name} />
          ))}
        </div>
        <h1>Components w/ Thumbnails</h1>
        <div className="grid">
          {components.map((component: any, i) => (
            <div className="component">
              {component.name}
              <img key={`${i}-component`} src={component.thumbnail} alt="" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;

import React, { PureComponent } from 'react';
import Highlighter from "react-highlight-words";

class ImageList extends PureComponent {
  render() {
    return (
      <div className="list-example">
        <div className="list-body">
        {
          this.props.list.map((item, index) => 
            <a href={item.src} key={index}>
            <ul key={index}>
              <ul>
              <Highlighter    
                highlightClassName="matched"
                searchWords={this.props.keywords || []}
                textToHighlight={item.name || ""}
              />
              </ul>
              <img className="anzuhanacon" src={item.src} />
            </ul>
            </a>
          )
        }
        </div>
      </div>
  )}
};
  
export default ImageList;
  
import React, { Component } from 'react';
import Highlighter from "react-highlight-words";
import _ from 'lodash';
// import * as Hangul from 'hangul-js';
import SyntaxHighlighter from 'react-syntax-highlighter';
import SearchField from '../components/SearchField';

import './App.css';

const ExampleList = props => {
    const found = !!props.list.length;
    return <div className="list-example">
      <div className="list-body" style={ found ? {} : { display: 'none' } }>
        <ul>{props.list.length} 개의 결과가 있습니다.</ul>
      </div>
      <div className="list-body" style={ !found && props.keywords ? {} : { display: 'none' } }>
        <ul>결과가 없어요 ㅠㅠ</ul>
      </div>
      <div className="list-body" style={ !found && !props.keywords ? {} : { display: 'none' } }>
        <ul>로딩중입니다...</ul>
      </div>
      <div className="list-body">
        {
          _.take(props.list, 5).map((item, index) => 
            <a href={item.imgurl}>
              <ul key={index}>
                <ul>
                  <Highlighter 
                    highlightClassName="matched"
                    searchWords={props.keywords || []}
                    textToHighlight={item.name || ""}
                  />
                </ul>
                <img className="anzuhanacon" src={item.imgurl} />
              </ul>
            </a>
          )
        }
      </div>
    </div>
  };

class App extends Component {
  constructor(props) {
    super(props);
    this.basicExampleList = [];

    this.state = {
      imglist: this.basicExampleList,
    };

    this.onBasicExampleChange = _.debounce(this.onBasicExampleChange.bind(this), 300, {
      leading: true,
      trailing: true
    });
  }

  componentDidMount(){
    (async() => {
      const data = await fetch('https://api.github.com/repos/astrine/eroge_radio/contents/img/')
      this.basicExampleList = (await data.json()).map(value => ({
          name: value.name.substring(0, value.name.lastIndexOf('.')),
          lowerCaseName: value.name.substring(0, value.name.lastIndexOf('.')).toLowerCase(),
          imgurl: value.download_url
      }));
      this.onBasicExampleChange("");
    })();
  }

  onBasicExampleChange(value) {
    const keywords = _.reject(value.toLowerCase().split(' '), _.isEmpty);

    this.setState({
      imglist: this.getMatchedList(keywords),
      keywords: keywords
    });
  }

  getMatchedList(keywords) {
    if (!keywords) return this.basicExampleList;
    return _(this.basicExampleList)
      .filter( value => _.every(keywords, key => value.lowerCaseName.includes(key)) )
      .value();
  }

  render() {
    return (
      <div className="react-search-field-demo container">
        <div>
          <h3>안즈하나콘 검색기</h3>
        </div>
        <div>
          <SearchField
            placeholder="검색어를 입력하세요"
            onChange={this.onBasicExampleChange}
          />
          <ExampleList
            list={this.state.imglist}
            keywords={this.state.keywords}
          />
        </div>
      </div>
    );
  }
}

export default App;

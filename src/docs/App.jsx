import React, { Component } from 'react';
import _ from 'lodash';
import SyntaxHighlighter from 'react-syntax-highlighter';
import SearchField from "react-search-field";
import ImageList from './ImageList';
import './App.css';


class App extends Component {
  constructor(props) {
    super(props);
    this.allList = [];

    this.state = {
      matchedlist: [],
      imgcnt: 5
    };

    this.onKeywordChanged = _.debounce(this.onKeywordChanged.bind(this), 300, {
      leading: true,
      trailing: true
    });
  }

  async componentDidMount(){
    const data = await fetch('https://api.github.com/repos/astrine/eroge_radio/contents/img/')
    this.allList = (await data.json()).map(value => ({
        name: value.name.substring(0, value.name.lastIndexOf('.')),
        src: value.download_url
    }));
    this.onKeywordChanged("");
  }
  
  componentWillMount() {
    window.addEventListener('scroll', () => {
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        this.setState({
          ...this.state, imgcnt: this.state.imgcnt + 5
        });
      }
    });
  }

  componentWillUnmount() {
    window.removeEventListener('scroll');
  }

  async onKeywordChanged(keyword) {
    const keywords = keyword.toLowerCase().split(' ').filter(_ => _);

    // const getSize = (url) => 
    //   new Promise((resolve, reject) => {
    //     const img = new Image();
        
    //     img.onerror = reject;
    //     img.onload = () => {
    //       const {width, height} = img;
    //       console.log({width, height})
    //       resolve({width, height});
    //     };
    //     img.src = url;
    //   });

    const matchedlist = this.getMatchedList(keywords);

    // const imglist = await Promise.all(
    //   this.matchedlist.map( 
    //     async (imginfo, idx) => {
    //       if (idx < imgcnd)
    //       return { ...(idx < imgcnd ? await getSize(imginfo.src) : { width: 0, height: 0 }), ...imginfo };
    //     } 
    //   ));
    
    this.setState({
      matchedlist,
      keywords,
      imgcnt: 5
    });
  }

  getMatchedList(keywords) {
    if (!keywords) return this.allList;
    return _(this.allList)
      .filter( value => _.every(keywords, key => value.name.toLowerCase().includes(key)) )
      .value();
  }

  render() {
    const found = this.state.matchedlist.length > 0;

    return (
      <div className="react-search-field-demo container">
        <div>
          <h3>안즈하나콘 검색기</h3>
        </div>
        <div>
          <SearchField
            placeholder="검색어를 입력하세요"
            onChange={this.onKeywordChanged}
          />
          
          <div className="list-body" style={ found ? {} : { display: 'none' } }>
            <ul>{this.state.matchedlist.length} 개의 결과가 있습니다.</ul>
          </div>
          <div className="list-body" style={ !found && this.state.keywords ? {} : { display: 'none' } }>
            <ul>결과가 없어요 ㅠㅠ</ul>
          </div>
          <div className="list-body" style={ !found && !this.state.keywords ? {} : { display: 'none' } }>
            <ul>로딩중입니다...</ul>
          </div>
          <ImageList
            list={_.take(this.state.matchedlist, this.state.imgcnt)}
            keywords={this.state.keywords}
          />
        </div>
      </div>
    );
  }
}

export default App;

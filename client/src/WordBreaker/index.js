import React from 'react';

import { Input, Spin, List, Space, message, Card, Layout } from 'antd';

import './index.css';
const { Header, Content, Footer } = Layout;
const WordBreaker = () => {
  const [word, setWord] = React.useState([]);
  const [wordList, setWordList] = React.useState([]);
  const [baseWordList, setBaseWordList] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [regexText, setRegexText] = React.useState('');
  const inputRef = React.useRef(null);
  const inputRef2 = React.useRef(null);
  const [remSeen, setRemSeen] = React.useState(false);

  React.useEffect(() => {
    inputRef.current.focus();
    return () => {};
  }, []);

  React.useEffect(() => {
    console.log(
      '🚀 ~ file: index.js ~ line 22 ~ React.useEffect ~ useEffect',
      remSeen
    );

    remSeen && inputRef2.current.focus();
  }, [remSeen]);

  const fakeDataUrl =
    'https://word-breaker-unscramble.herokuapp.com/fetch?url=https://theunscrambled.com/unscramble-';

  const fetchData = (word) => {
    console.log('fetchData', word);
    setLoading(true);

    fetch(fakeDataUrl + word)
      .then((res) => {
        return res.text();
      })
      .then(function (res) {
        //console.log('🚀 ~ file: index.js ~ line 25 ~ res', res);
        if (res.length === 0) {
          message.error(
            'Looks like there was a problem. Status Code: ' + res.status
          );
          setLoading(false);
        }

        // Examine the text in the response

        //console.log('🚀 ~ file: index.js ~ line 31 ~ res', res);

        let firstVariable = '<script type="application/ld+json">';
        let secondVariable = '</script>';
        let mySubString = res
          .split(firstVariable)
          .pop()
          .split(secondVariable)[0];

        //console.log('🚀 ~ file: index.js ~ line 37 ~ mySubString', mySubString);

        let data = JSON.parse(mySubString);
        //console.log('🚀 ~ file: index.js ~ line 44 ~ data', data);

        setWordList(data.itemListElement);
        setBaseWordList(data.itemListElement);
        setLoading(false);
        setRemSeen(true);
      })
      .catch(function (err) {
        message.error('Fetch Error :-S' + err);
        setLoading(false);
        setRemSeen(true);
      });
  };

  const onChangeMainWord = (e) => {
    setRegexText('');
    setWordList([]);
    setBaseWordList([]);
    setRemSeen(false);
  };

  const onSearchWord = (word) => {
    //console.log('🚀 ~ file: index.js ~ line 94 ~ onSearchWord ~ word =', word);
    if (word.length === 0) {
      return;
    }
    setRegexText('');

    setWord(word.toLowerCase());
    fetchData(word.toLowerCase());
    //inputRef2.current.focus();
  };
  const onPressEnter = (e) => {
    //console.log('🚀 ~ file: index.js ~ line 93 ~ onPressEnter ~ e', e);
    onSearchWord(e.target.value);
  };

  const onChangeRegex = (e) => {
    //console.log(e.target.value);
    let val = e.target.value;
    //Take only a-z letter and white space
    // regex for this is  ->    /^[a-z ]*$/gm
    const regexTest = new RegExp('^[a-zA-Z ]*$');

    if (regexTest.test(val)) {
      setRegexText(val);
    } else {
      //e.preventDefault();
      return;
    }
    // setRegexText(val);
    if (val.trim().length === 0) {
      setWordList(baseWordList);
      return;
    }
    val = val.split(' ').join('.');
    // console.log('🚀 ~ file: index.js ~ line 77 ~ onChange ~ val', val);
    const regex = new RegExp('^' + val.toLowerCase() + '$');
    let _wordList = baseWordList.filter(
      (item) =>
        item.name.length === val.length && regex.test(item.name.toLowerCase())
    );
    setWordList(_wordList);
    //console.log(_wordList);
  };

  return (
    <>
      <Layout>
        <Layout>
          {/* <Header
            className="site-layout-sub-header-background"
            style={{ padding: 0 }}
          /> */}
          <Content>
            <div className="site-card-border-less-wrapper">
              <Card
                title="Unscramble Game Breaker"
                bordered={true}
                style={{ width: '100%', border: '0px solid red' }}
              >
                <Space size="large" direction="vertical">
                  <Input.Search
                    placeholder="Enter Word to Unscramble"
                    //allowClear
                    enterButton="Search"
                    size="large"
                    onSearch={onSearchWord}
                    maxLength="12"
                    onPressEnter={onPressEnter}
                    ref={inputRef}
                    loading={loading}
                    onChange={onChangeMainWord}
                  />

                  {remSeen && word.length > 0 && (
                    <>
                      <Input
                        placeholder="Enter word to Search"
                        maxLength={word.length}
                        onChange={onChangeRegex}
                        value={regexText}
                        id="regex"
                        name="regex"
                        disabled={loading}
                        ref={inputRef2}
                      />

                      <div className="demo-infinite-container">
                        <Spin tip="Loading..." spinning={loading}>
                          <List
                            size="small"
                            bordered
                            dataSource={wordList}
                            renderItem={(item) => (
                              <List.Item>{item.name}</List.Item>
                            )}
                          />
                        </Spin>
                      </div>
                    </>
                  )}
                </Space>
              </Card>
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            ©2021 Created by Lalit Tolani
          </Footer>
        </Layout>
      </Layout>
    </>
  );
};

export default WordBreaker;

// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import routes from '../constants/routes';
import styles from './Home.css';
import Terminal from './Terminal';
import Editor from './Editor';
//import { xtermInstance } from "./XtermHelper";


type Props = {};

export default class Home extends Component<Props> {
  props: Props;

  componentDidMount() {
    // const myNotification = new Notification('Title', {
    //   body: 'Lorem Ipsum Dolor Sit Amet'
    // })
    
    // myNotification.onclick = () => {
    //   console.log('Notification clicked')
    // }
  }
  render() {
    return (
      <div className="" data-tid="container">
        <Editor />
        <Terminal />
      </div>
    );
  }
}

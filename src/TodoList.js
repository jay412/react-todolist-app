import React, { Component } from "react";
import TodoItems from "./TodoItems";
import "./css/TodoList.css";
import { DB_CONFIG } from './config/config';
import firebase from 'firebase/app';
import 'firebase/database';

class TodoList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: []
    };

    this.app = firebase.initializeApp(DB_CONFIG);
    this.database = this.app.database().ref().child('items');

    this.addItem = this.addItem.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
  }

  componentWillMount() {
    const previousItems = this.state.items;

    // Data Snapshot
    this.database.on('child_added', snap => {
      previousItems.push({
        key: snap.key,
        text: snap.val().text,
      })

      this.setState({
        items: previousItems
      })
    })

    this.database.on('child_removed', snap => {
      for(var x = 0; x < previousItems.length; ++x) {
        if(previousItems[x].key === snap.key){
          previousItems.splice(x, 1);
        }
      }

      this.setState({
        items: previousItems
      })
    })
  }

  addItem(e) {
    if (this._inputElement.value !== "") {
      this.database.push().set({ text: this._inputElement.value});
    }

    this._inputElement.value = "";

    e.preventDefault();
  }

  deleteItem(key) {
    this.database.child(key).remove();
  }

  render() {
    return (

      <div className="todoListMain">

      <div className="header">
        <div className="heading">Firebase To-Do List</div>
      </div>

      <div className="itemsBody">
        <form onSubmit={this.addItem}>
          <input ref={(a) => this._inputElement = a}
          placeholder="Enter Task">
          </input>
          <button type="submit">Add</button>
        </form>

        <TodoItems entries={this.state.items}
        delete={this.deleteItem}/>
      </div>
      </div>
    );
  }
}

export default TodoList;

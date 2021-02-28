import React, { Component } from 'react';
import ReactTable from "react-table-6";
import "react-table-6/react-table.css";
import {db} from './firebase'

    class App extends Component {
      constructor(){
        super()
        this.state={myData:""}

        this.nameRef= React.createRef()
        this.subjectRef= React.createRef()
        this.roleRef= React.createRef()
        this.classRef= React.createRef()

        this.selectRef= React.createRef()

        this.updateName = React.createRef()
        this.updateSubject = React.createRef()
        this.updateRole = React.createRef()
        this.updateClass = React.createRef()
      }

      componentDidMount(){
        db.on("value", (snapshot) =>{
          let myData = ""
          myData = (snapshot.val().students);
          this.setState({myData})
        }, function (errorObject) {
          console.log("The read failed: " + errorObject.code);
        })
      }

      addData(e){
        e.preventDefault()
        var studentsRef = db.child("students");
        studentsRef.child(this.state.myData.length).set({
          "id":this.state.myData.length+1,
          "fullName": this.nameRef.current.value,
          "subject": this.subjectRef.current.value,
          "roll": this.roleRef.current.value,
          "class": this.classRef.current.value
        });
        this.nameRef.current.value=""
        this.subjectRef.current.value=""
        this.roleRef.current.value=""
        this.classRef.current.value=""
      }

      deleteItem(e){
        e.preventDefault()
        if (this.selectRef.current.value !== "-1"){
          db.child("students").child(this.selectRef.current.value-1).remove()
        }
      }

      updateItem(e){
        e.preventDefault()
        if (this.selectRef.current.value !== "-1"){
          var studentsRef = db.child("students");

          studentsRef.child(this.selectRef.current.value - 1).update({
            "fullName": this.updateName.current.value || this.state.myData[this.selectRef.current.value - 1].fullName ,
            "subject": this.updateSubject.current.value || this.state.myData[this.selectRef.current.value - 1].subject,
            "roll": this.updateRole.current.value || this.state.myData[this.selectRef.current.value - 1].roll,
            "class": this.updateClass.current.value || this.state.myData[this.selectRef.current.value - 1].class
          });
  
          this.updateName.current.value=""
          this.updateSubject.current.value=""
          this.updateRole.current.value=""
          this.updateClass.current.value=""
        }
      }

      render() {

         const columns = [{
          Header: '#',
          accessor: 'id'
          },{
           Header: 'Full Name',
           accessor: 'fullName'
           },{
           Header: 'Subject',
           accessor: 'subject'
           },
          {
            Header: 'Role',
            accessor: 'roll'
          },
          {
            Header: 'Class',
            accessor: 'class'
          }]

        return (
              <div>
                {console.log(this.state.myData)}
                <h1>React Data Table</h1>
                {this.state.myData? 
                  <ReactTable
                      data={this.state.myData.filter((element)=>{return (element!==false)})}
                      columns={columns}
                      defaultPageSize = {4}
                      pageSizeOptions = {[2,4,6]}
                  />
                  : <div>loading...</div>
                }
                <form style={{padding:"5px"}} onSubmit={(e)=>this.addData(e)}>
                  <div>
                    <input ref={this.nameRef} placeholder="name" type="text" required/>
                  </div>
                  <div>
                    <input ref={this.subjectRef} placeholder="subject" type="text" required/>
                  </div>
                  <div>
                    <input ref={this.roleRef} type="text" placeholder="role" required/>
                  </div>
                  <div>
                    <input ref={this.classRef} type="text" placeholder="class" required/>
                  </div>
                  <button>ADD DATA</button>
                </form>

                {this.state.myData?
                  <form onSubmit={(e)=>this.deleteItem(e)}>
                    <select ref={this.selectRef}>
                      <option value="-1">please select a row</option>
                      {this.state.myData.map((element,id)=>
                      <option key={id} value={element.id}>Row number {element.id}</option>)}
                    </select>
                    <button>DELETE ITEM</button>
                  </form>
                  : <div>loading...</div>
                }

                <form style={{padding:"5px"}} onSubmit={(e)=>this.updateItem(e)}>
                <span>Please leave blank to keep unchanged</span><br/>
                  <div>
                    <input ref={this.updateName} placeholder="name" type="text" />
                  </div>
                  <div>
                    <input ref={this.updateSubject} placeholder="subject" type="text" />
                  </div>
                  <div>
                    <input ref={this.updateRole} type="text" placeholder="role" />
                  </div>
                  <div>
                    <input ref={this.updateClass} type="text" placeholder="class" />
                  </div>
                  <button>UPDATE ITEM</button>
                </form>

              </div>
        )
      }
    }
    export default App;

import React, { Component } from 'react';
import ReactTable from "react-table-6";
import "react-table-6/react-table.css";
import {db} from './firebase'

    class App extends Component {
      constructor(){
        super()
        this.state={myData:"", showAdd:"none", showUpdate:"none", toUpdate:""}

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
          console.log(myData)
          for (let obj of myData){
            if (obj){
              obj.action = <div><button onClick={()=>this.showUpdate(obj.id)}>Edit</button><button onClick={()=>this.removeItem(obj.id)}>Remove</button></div>
            }
          }
          this.setState({myData})

        }, function (errorObject) {
          console.log("The read failed: " + errorObject.code);
        })
      }

      removeItem(id){
        if (window.confirm("please confirm to delete item no."+id)){
          db.child("students").child(id-1).remove()
        }
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
        this.setState({showAdd:"none"})
      }

      showUpdate(id){
        this.setState({showUpdate:"block", toUpdate:id })
      }

      updateItem(e){
        e.preventDefault()
        var studentsRef = db.child("students");

        studentsRef.child(this.state.toUpdate-1).update({
            "fullName": this.updateName.current.value || this.state.myData[this.state.toUpdate-1].fullName ,
            "subject": this.updateSubject.current.value || this.state.myData[this.state.toUpdate-1].subject,
            "roll": this.updateRole.current.value || this.state.myData[this.state.toUpdate-1].roll,
            "class": this.updateClass.current.value || this.state.myData[this.state.toUpdate-1].class
        })

          this.updateName.current.value=""
          this.updateSubject.current.value=""
          this.updateRole.current.value=""
          this.updateClass.current.value=""
          this.setState({showUpdate:"none", toUpdate:""})
        
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
            accessor: 'roll',
          },
          {
            Header: 'Class',
            accessor: 'class'
          },
          {
            Header: 'Action',
            accessor: 'action'
          },
        ]

        return (
              <div>
                {console.log(this.state.myData)}
                <h1>React Data Table</h1>
                {this.state.myData? 
                  <ReactTable
                      data={this.state.myData.filter((element)=>{return (element!==false)})}
                      // data = {{id:<button>click</button>}}
                      columns={columns}
                      defaultPageSize = {4}
                      pageSizeOptions = {[2,4,6]}
                  />
                  : <div>loading...</div>
                }
                <button onClick={()=>this.setState({showAdd:"block"})}>Create a new item</button>
                <form style={{padding:"5px",display:this.state.showAdd}} onSubmit={(e)=>this.addData(e)}>
                  <div>
                    <input style={{width:"200px"}} ref={this.nameRef} placeholder="name" type="text" required/>
                  </div>
                  <div>
                  <span>please select a subject</span><br/>
                    <select style={{width:"200px"}} ref={this.subjectRef}>
                      <option value="Firebase RealTime Database">Firebase RealTime Database</option>
                      <option value="Math">React</option>
                    </select>
                  </div>
                  <div>
                    <span>please select a role</span><br/>
                    <select style={{width:"200px"}} ref={this.roleRef}>
                      <option value="Teacher">Teacher</option>
                      <option value="Student">Student</option>
                    </select>
                  </div>
                  <div>
                    <span>please select a class</span><br/>
                    <select style={{width:"200px"}} ref={this.classRef}>
                      <option value="Computer Science">Computer Science</option>
                      <option value="Math">Math</option>
                    </select>
                  </div>
                  <button>ADD DATA</button>
                </form>


                <form style={{padding:"5px", display:this.state.showUpdate}} onSubmit={(e)=>this.updateItem(e)}>
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

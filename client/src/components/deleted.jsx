import React, { Component } from 'react'
import './home.css'
import Delete from './assets/acv.png'

import { Redirect} from 'react-router-dom'


import { connect } from 'react-redux'

class Deleted extends Component {
    state = {
        size: window.innerWidth,
        item: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
        search: '',
        deleted:[
            { _id:'1',subject:'emaidhjfhfhjfjhfl',delete_color: "false" },
            { _id: '2',subject:'emaighdhjfhjhfjl', delete_color: "false" },
            { _id: '3',subject:'emahfjhfjgil', delete_color: "false" },
            { _id: '4',subject:'emaisghdjhfjfjl', delete_color: "false" },
            { _id: '5',subject:'emajtiutiil', delete_color: "false" },
            { _id: '6',subject:'emayututiutil', delete_color: "false" },
            { _id:'7',subject:'emadhjfhjfil', delete_color: "false" },
            { _id: '8',subject:'email', delete_color: "false" },
            { _id: '9',subject:'ematiutitiil', delete_color: "false" },
            { _id: '10',subject:'emtiutiuail', delete_color: "false" },
            { _id: '11',subject:'ematitiutil', delete_color:"false"},

        ],


        achieving:[],
        
        user_email:'',
        

    }


    size = () => {
        const wide = () => {
            this.setState({
                size: window.innerWidth
            })
             }
      console.log('size',window.innerWidth)
        window.addEventListener('resize', wide, false)
    }


    componentDidMount() {
        this.size()
        window.scrollTo({
            behavior: 'smooth',
            top: 0
        })

      }

    
      handleSeach = event => {
        const target = event.target;
        const name = target.name;
        const value = target.value;
        this.setState({ [name]: value })
    };



    select_achieve= (e) => {
        const check = this.state.achieving.filter(d => d === e)
        
       if(typeof check[0] !== 'string'){
           const filtering = this.state.deleted.filter(i => i._id === e)
          filtering.forEach(x => { return x.achieve_color = "true" })
           const filter_not = this.state.deleted.filter(i => i._id !== e)
      
        this.setState({
            deleted: [...filter_not, ...filtering].sort((a, b) => a._id - b._id),
            achieving: [...this.state.achieving, ...[filtering[0]._id]]
        })

       } else {
           
           const unfiltering = this.state.deleted.filter(i => i._id === e)
           unfiltering.forEach(x => { return x.achieve_color = "false" })
        const unfilter_not = this.state.deleted.filter(i => i._id !== e)
      
       const undeliting= this.state.achieving.filter(dx => dx !== e)
           
        this.setState({
            deleted: [...unfilter_not,...unfiltering].sort((a, b) => a._id - b._id),
            achieving:undeliting
        })
         }
    
    }



    achieve = () => {


        if (this.state.user_email.length > 0 && this.state.deleting.length > 0) {
            const data = {
                user_email: this.state.user_email,
                deleting: this.state.deleting
            }

            fetch(`https://loadshedding-api.sintrex.com/getSchedules`, {
                method: 'GET',
        
                headers: {
                    'content-type': 'application/json',
                    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJhOGpiQXI4SjQzZll5b3JxR1JWd2UzZ0Nma2wxIiwiaWF0IjoxNjI5NTU1MTAzfQ.yhk098mC7EFtPGzupMcxyJgBGGx98fms2Jb5W1siBfE'
         
                },
                body: JSON.stringify(data)
     
            }).then((response) => response.json()).then(data => {
  
              if(!data.erros){

                this.set({
                    inbox: [data],
                    deleting:[],
                    
                })
            }else{

                this.setState({ not_login: true })
            
                setTimeout(() => {
                    this.setState({ not_login: false })
                },5000)
            }

            }).catch()
            
        } else {
            this.setState({ not_login: true })
            
            setTimeout(() => {
                this.setState({ not_login: false })
            },5000)
        }
        
    }

    

    render() {
        const data = JSON.parse(localStorage.getItem('accont'))
        if (data === null) {
           ()=> <Redirect to='/signin' />
        } 
     
        return (
            <div style={{ marginLeft: this.state.size <= 600 && '0px', height: `${window.innerHeight-30 }px`}} className="home">
                
                <div className="home-body">

                    {this.state.achieving.length > 0 && <div className="dele-mark">
                        <div className="selected-delo">
                            <span>{`${this.state.achieving.length}`}</span>
                        </div>
                        <div onClick={this.achieve} className="selected-del">
                            <span>{this.state.achieving.length <= 1 ? 'Achieve' : 'Achieve All'}</span>
                        </div>
                    </div>}

                    <div className="home-body-scroll">
                        <div className="home-body-scroll1">
                           
                           
                           {this.state.deleted.map(e=>{return(<div key={e._id}  className="item">
                                <div className="label-item">
                                <div className="label-item-5">
                                        <span className="no-fl">Deleted</span>
                                              
                                   </div>
                                   <div className="label-item-6">
                                        <div className="hide-lab">
                                       <div className="no-flex-hide">
                                        <span>Recover email</span>
                                            </div>
                                            </div>      
                                   </div>
                                   
                                </div>

                                <div className="from">
                                    <div className="hide-from">
                                        <span>Linkedin</span>
                                    </div>
                                </div>
                                <div className="text-item">
                                <div className="hide-lab-text">
                                       
                                       <span>special text The 7-day week is the international standard that is used by the majority of the world. There are 52 or 53 weeks in a year, but countries vary on how they </span>
                                           </div>
                                </div>
                                <div className="time-item">
                                    <span>17-jan-21 07:12</span>
                                </div>
                               <div onClick={() => { this.select_achieve(e._id) }} style={{ backgroundColor: e.achieve_color === "true" ? 'rgb(30, 255, 0)' : 'black' }} className="delete-item2">
                                    <img src={Delete} alt='delete' className="deleting" />
                                </div>
                                
                            </div>)})}
                    </div>
                </div>
                </div>

            </div>
        )
    }

}

const mapStateToProps = state => {
    return {
        anyplay: state.cliReducer,
    }
};


export default connect(mapStateToProps, {})(Deleted);


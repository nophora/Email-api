import React, { Component } from 'react'
import './home.css'
import Search from './assets/search.png'
import Delete from './assets/delete.png'
import { Redirect} from 'react-router-dom'

import { connect } from 'react-redux'

class Home extends Component {
    state = {
        size: window.innerWidth,
        search: '',
        inbox: [
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
        deleting: [],
        
        user_email:'',
        
    }


    size = () => {
        const wide = () => {
            this.setState({
                size: window.innerWidth
            })
             }
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

    
     select_delete= (e) => {
        const check = this.state.deleting.filter(d => d === e)
        
       if(typeof check[0] !== 'string'){
           const filtering = this.state.inbox.filter(i => i._id === e)
          filtering.forEach(x => { return x.delete_color = "true" })
           const filter_not = this.state.inbox.filter(i => i._id !== e)
      
        this.setState({
            inbox: [...filter_not, ...filtering].sort((a, b) => a._id - b._id),
            deleting: [...this.state.deleting, ...[filtering[0]._id]]
        })

       } else {
           
           const unfiltering = this.state.inbox.filter(i => i._id === e)
           unfiltering.forEach(x => { return x.delete_color = "false" })
        const unfilter_not = this.state.inbox.filter(i => i._id !== e)
      
       const undeliting= this.state.deleting.filter(dx => dx !== e)
           
        this.setState({
            inbox: [...unfilter_not,...unfiltering].sort((a, b) => a._id - b._id),
            deleting:undeliting
        })
         }
    
    }

  



    delete = () => {


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
                    inbox: data.inbox,
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
                this.setState({ not_login: false})
            },5000)
        }
        
    }




   

    render() {
        
        const search = this.state.inbox.filter(f => { return f.subject.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1; });
  const data = JSON.parse(localStorage.getItem('accont'))
        if (data === null) {
           ()=> <Redirect to='/signin' />
        }

        return (
            <div style={{ marginLeft: this.state.size <= 600 && '0px', height: `${window.innerHeight-30 }px`}} className="home">
                <div className="search">
                    <div className="search2">
                        <input value={this.state.search} name='search' onChange={this.handleSeach} placeholder={`Seach inbox`} className='serch-input' />
                        <img src={Search} alt="search" className='search-icon'/>
                    </div> 
                </div>  
                <div className="home-body">

                    {this.state.deleting.length>0&&<div className="dele-mark">
                        <div className="selected-delo">
                            <span>{`${this.state.deleting.length}`}</span>
                        </div>
                        <div onClick={this.delete} className="selected-del">
                            <span>{this.state.deleting.length<=1?'Delete':'Delete All'}</span>
                        </div>
                    </div>}

                    <div className="home-body-scroll">
                        <div className="home-body-scroll1">
                           
                           
                            {this.state.inbox.map(e => {
                                return (<div key={e._id}  className="item">
                                <div className="label-item">
                                <div className="label-item-2">
                                        <span className="no-fl">Inbox</span>
                                              
                                   </div>
                                   <div className="label-item-1">
                                        <div className="hide-lab">
                                       <div className="no-flex-hide">
                                        <span>special text</span>
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
                                <div onClick={() => { this.select_delete(e._id) } } style={{backgroundColor:e.delete_color=== "true"?'red':'black'}} className="delete-item">
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


export default connect(mapStateToProps, {})(Home);


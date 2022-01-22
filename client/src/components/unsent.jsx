import React, { Component } from 'react'
import './home.css'
import { Redirect} from 'react-router-dom'

import { connect } from 'react-redux'

class Unsent extends Component {
    state = {
        size: window.innerWidth,
        item: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
        search: '',
        inbox:[]
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

    
     
    

    render() {
        
     
        return (
            <div style={{ marginLeft: this.state.size <= 600 && '0px', height: `${window.innerHeight-30 }px`}} className="home">
                
                <div className="home-body">

                  

                    <div className="home-body-scroll">
                        <div className="home-body-scroll1">
                           
                           
                           {this.state.item.map(e=>{return(<div className="item">
                                <div className="label-item">
                                <div className="label-item-4">
                                        <span className="no-fl">not sent</span>
                                              
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


export default connect(mapStateToProps, {})(Unsent);


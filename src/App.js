import React from 'react';
import './App.css';
import ReactTooltip from 'react-tooltip';

export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      start: "00:00:00",
      end: "00:00:00",
      slots: [],
      total_dur: 0,
      accu_dur: 0
    }

    this.updateStartEnd = this.updateStartEnd.bind(this)
  }

  timeToNum(time){
    if (time.split(":").length > 2){
      return parseInt(time.split(":")[0])*60*60 + parseInt(time.split(":")[1])*60 + parseInt(time.split(":")[2])
    } else {
      return parseInt(time.split(":")[0])*60*60 + parseInt(time.split(":")[1])*60
    }
  }

  numToTime(num){
    let h =  Math.floor(num/3600)
    let m = Math.floor((num-h*3600)/60)
    let s = num-h*3600 - m*60
  
    if (h.toString().length < 2){
      h = "0" + h.toString()
    }
  
    if (m.toString().length < 2){
      m = "0" + m.toString()
    }
  
    if (s.toString().length < 2){
      s = "0" + s.toString()
    }
    return h + ":" + m + ":" + s
  }

  updateStartEnd(e){
    this.setState({[e.target.name]: e.target.value})
  }

  breakdown(){
    this.setState({total_dur: Math.floor((this.timeToNum(this.state.end) - this.timeToNum(this.state.start))/60)})
    this.setState({slots: [...this.state.slots, [this.state.start, this.state.start, 0]]})
  }

  updateRows(cur, slots){
    const n = slots.length
    if (cur < n-1){
      for (let j =cur; j < n-1; j++){
        slots[j+1][0] = slots[j][1]
        slots[j+1][1] = this.numToTime(this.timeToNum(slots[j+1][0]) + slots[j+1][2]*60)
      }
    }

    return slots
  }

  handleChange(e, i, x){
    let slotsCopy = this.state.slots
    slotsCopy[i][x] = e.target.value
    slotsCopy[i][2] = Math.floor((this.timeToNum(slotsCopy[i][1]) - this.timeToNum(slotsCopy[i][0]))/60)
    if (x == 1){
      slotsCopy = this.updateRows(i, slotsCopy)
    }
    this.setState({slots: slotsCopy})
  }

  addRow(i){
    const lastSlot = this.state.slots[i]
    const slotsCopy = this.state.slots
    slotsCopy.splice(i+1, 0, [lastSlot[1], lastSlot[1], 0])
    this.setState({slots: slotsCopy})
  }

  removeRow(i){
    let slotsCopy = this.state.slots
    slotsCopy.splice(i,1)
    slotsCopy = this.updateRows(i-1, slotsCopy)
    this.setState({slots: slotsCopy})
  }

  render(){

    const { start, end, slots} = this.state

    console.log('start', start, 'end', end)
    console.log(slots)

    if (slots.length >0){
      let lastEnd = slots[slots.length - 1][1]

      if (this.timeToNum(lastEnd) > this.timeToNum(end)){
        alert("It's overtime")
        this.removeRow(slots.length - 1)
      }
    }

    return (
      <div className="App">
        <h1>VILT training management simulation</h1>
        <label>
          Start training
            <input
              type="time"
              name="start"
              onChange={this.updateStartEnd} 
              value={start}
              step="1"
            />
        </label>
        <label>
          End training
            <input
              type="time"
              name="end"
              value={end}
              step="1"
              onChange={this.updateStartEnd}  
            />
        </label>
        <p>Total time</p>
        <p>{Math.floor((this.timeToNum(end) - this.timeToNum(start))/60)} m</p>
        <button onClick={() => this.breakdown()}>Breakdown</button>
        <div className="sessions">
          <div className="headers">
            <p className="start">Start session</p>
            <p className="end">End session</p>
            <p className="duration">Duration</p>
            <p className="duration">Content</p>
          </div>
          {this.state.slots
          ? slots.map((slot, i) => 
            <div className="each_session">
              <input 
                className="start"
                value = {slot[0]}
                type="time"
                step="1"
                onChange={e => this.handleChange(e, i, 0)}
              />
              <input 
                className="end"
                value = {slot[1]}
                type="time"
                step="1"
                onChange={e => this.handleChange(e, i, 1)}
              />
              <p className="duration" id="dur">{slot[2]}</p>
              <button 
                className="btn" 
                onClick={() => this.addRow(i)}
                data-tip="add row"
              >+</button>
              <button 
                className="btn" 
                onClick={() => this.removeRow(i)}
                data-tip="remove row"
              >-</button>
              <ReactTooltip />
            </div>
          )
          : null}
        </div>
      </div>
    )
  }

}


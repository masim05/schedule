var socket = undefined;

var ActBox = React.createClass({
	render: function() {
		console.log('ActBox.render() called.');
		return (
			<div className="actBox">
			<div className="page-header">
				<h1>Активности</h1>
			</div>
			<ActForm />
			<ActList />
			</div>
		)
	}
});
var ActList = React.createClass({
	getInitialState: function() {
		return {
			acts: []
		}
	},
	componentDidMount: function() {
		socket = io.connect(document.location.href);
		socket.on('error', function (error) {
		  console.log('Error on socket', error);
		});
		socket.on('refreshActs', function(data) {
			console.log('refreshActs', data);
			this.setState(data);
		}.bind(this));
	},
	render: function() {
		console.log('ActList.render() called.');
		var actNodes = this.state.acts.map(function(act) {
			return (
				<Act act={act} key={act.date +act.time + act.type + act.state} />
			)
		});
		return (
			<div className="actList">
			<h3>Недавние активности</h3>
			{actNodes}
			</div>
		);
}
});
var Act = React.createClass({
	render: function () {
		var properties = [
			<div className="col-md-2 col-xs-4" key="date">{this.props.act.date}</div>,
			<div className="col-md-1 col-xs-2" key="time">{this.props.act.time}</div>,
			<div className="col-md-2 col-xs-3" key="type">{this.props.act.type}</div>,
			<div className="col-md-2 col-xs-3" key="state">{this.props.act.state}</div>
		];
		if (this.props.act.comment) {
			properties.push(
				<div className="col-md-2 col-xs-12 light" key="comment">{this.props.act.comment}</div>
			);
		}
		return (
			<div className="act, row">
				{properties}
			</div>
		)
	}
});
var ActForm = React.createClass({
	getInitialState: function() {
		var now = moment();
		return {
			date: now.format('YYYY-MM-DD'),
			time: now.format('HH:mm'),
			type: 'Сон',
			state: 'Начало'
		};
	},
	componentDidMount: function() {
		var self = this;
		var datetimeInterval = setInterval(function() {
			var now = moment();
			console.log('tick', now);
			self.setState({
				date: now.format('YYYY-MM-DD'),
				time: now.format('HH:mm')
			});
		}, 2 * 60 * 1000);

		self.setState({
			datetimeInterval: datetimeInterval
		});
	},
	componentWillUnmount: function() {
		clearInterval(this.state.datetimeInterval);
	},
	handleDateChange: function(e) {
		this.setState({date: e.target.value});
	},
	handleTimeChange: function(e) {
		this.setState({time: e.target.value});
	},
	handleTypeChange: function(e) {
		this.setState({type: e.target.value});
	},
	handleStateChange: function(e) {
		this.setState({state: e.target.value});
	},
	handleCommentChange: function(e) {
		this.setState({comment: e.target.value});
	},
	handleSubmit: function(e) {
		e.preventDefault();
		if (!this.state.date || !this.state.time || !this.state.type || !this.state.state){
			return;
		}
		socket.emit('createAct', {act: this.state});

		var now = moment();
		this.setState({
			date: now.format('YYYY-MM-DD'),
			time: now.format('HH:mm'),
			type: 'Сон',
			state: 'Начало',
			comment: ''
		});
	},
	render: function () {
		var self = this;
		var typeNodes = ['Сон', 'Кормление', 'Активное бодрствование'].map(function(type, id) {
			return (
				<tr key={id}>
				<td>
				<input type="radio" name="type" value={type} id={'type-' + id}
				checked={self.state.type == type} onChange={self.handleTypeChange}/>
				</td>
				<td><label htmlFor={'type-' + id} >{type}</label></td>
				</tr>
			)
		});
		var stateNodes = ['Начало', 'Конец'].map(function(state, id) {
			return (
				<tr key={id}>
				<td>
				<input type="radio" name="state" value={state} id={'state-' + id}
				checked={self.state.state == state} onChange={self.handleStateChange}/>
				</td>
				<td><label htmlFor={'state-' + id} >{state}</label></td>
				</tr>
			)
	  });
		return (
			<form className="actForm" onSubmit={this.handleSubmit}>
				<h3>Новая активность</h3>
				Дата:
				<input
					type="date"
					className="form-control"
					value={this.state.date}
					onChange={this.handleDateChange}
				/>
				<br/>
				Время:
				<input
					type="time"
					className="form-control"
					value={this.state.time}
					onChange={this.handleTimeChange}
				/>
				<br/>
				Занятие:
				<table><tbody>
				{typeNodes}
				</tbody></table>

				Состояние:
				<table><tbody>
				{stateNodes}
				</tbody></table>

				Комментарий:
				<input
					type="text"
					className="form-control"
					value={this.state.comment}
					onChange={this.handleCommentChange}
				/>
				<br/>
				<input type="submit" value="Добавить" />
				</form>
		)
	}
});

ReactDOM.render(
	<ActBox/>,
  document.getElementById('content')
);

var socket = undefined;

var ActBox = React.createClass({
	render: function() {
		return (
			<div className="actBox">
			<div className="page-header">
			<h1>Baby scheduler v0.1.0</h1>
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
		  console.error('Error on socket', error);
		});
		socket.on('refreshActs', function(data) {
			this.setState(data);
		}.bind(this));
	},
	render: function() {
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
				<label
					htmlFor={'type-' + id}
					className={"btn btn-primary" + (self.state.type == type ? ' active' : '')}
					key={id}>
				{type}
				<input type="radio" name="type" className="hidden" value={type} id={'type-' + id}
				checked={self.state.type == type} onChange={self.handleTypeChange}/>
				</label>
			)
		});
		var stateNodes = ['Начало', 'Конец'].map(function(state, id) {
			return (
				<label
					htmlFor={'state-' + id}
					className={"btn btn-primary" + (self.state.state == state ? ' active' : '')}
					key={id}>
				{state}
				<input type="radio" name="state" className="hidden" value={state}
				id={'state-' + id} checked={self.state.state == state}
				onChange={self.handleStateChange}/>
				</label>
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

				Занятие:<br/>
				<div className="btn-group" data-toggle="buttons">
				{typeNodes}
				</div>
				<br/><br/>

				Состояние:<br/>
				<div className="btn-group" data-toggle="buttons">
				{stateNodes}
				</div>
				<br/><br/>

				Комментарий:
				<input
					type="text"
					className="form-control"
					value={this.state.comment}
					onChange={this.handleCommentChange}
				/>
				<br/>
				<input
					type="submit"
					className="btn btn-lg btn-primary btn-block"
					value="Добавить" />
				</form>
		)
	}
});

ReactDOM.render(
	<ActBox/>,
  document.getElementById('content')
);

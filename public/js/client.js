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
				<Act act={act} key={act.start.date + act.start.time + act.type} />
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
			<div className="col-md-2 col-xs-4" key="date">{this.props.act.start.date}</div>,
			<div className="col-md-1 col-xs-2" key="time">{this.props.act.start.time}</div>,
			<div className="col-md-4 col-xs-6" key="type">{this.props.act.type}</div>,
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
			'act.start.date': now.format('YYYY-MM-DD'),
			'act.start.time': now.format('HH:mm'),
			'act.type': 'Сон',
			'act.comment': ''
		};
	},
	componentDidMount: function() {
		var self = this;
		var datetimeInterval = setInterval(function() {
			var now = moment();
			self.setState({
				'act.start.date': now.format('YYYY-MM-DD'),
				'act.start.time': now.format('HH:mm')
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
		this.setState({
			'act.start.date': e.target.value
		});
	},
	handleTimeChange: function(e) {
		this.setState({
			'act.start.time': e.target.value
		});
	},
	handleTypeChange: function(e) {
		this.setState({
			'act.type': e.target.value
		});
	},
	handleCommentChange: function(e) {
		this.setState({
			'act.comment': e.target.value
		});
	},
	handleSubmit: function(e) {
		e.preventDefault();
		if (!this.state['act.start.date'] || !this.state['act.start.time'] ||
				!this.state['act.type']){
					return;
		}
		socket.emit('createAct', {
			act: {
				start: {
					date: this.state['act.start.date'],
					time: this.state['act.start.time']
				},
				type: this.state['act.type'],
				comment: this.state['act.comment']
			}
		});

		var now = moment();
		this.setState({
			'act.start.date': now.format('YYYY-MM-DD'),
			'act.start.time': now.format('HH:mm'),
			'act.type': 'Сон',
			'act.comment': ''
		});
	},
	render: function () {
		var self = this;
		var typeNodes = ['Сон', 'Кормление', 'Активное бодрствование'].map(function(type, id) {
			return (
				<label
					htmlFor={'type-' + id}
					className={"btn btn-primary" + (self.state["act.type"] == type ? ' active' : '')}
					key={id}>
				{type}
				<input type="radio" name="type" className="hidden" value={type} id={'type-' + id}
				checked={self.state["act.type"] == type} onChange={self.handleTypeChange}/>
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
					value={this.state["act.start.date"]}
					onChange={this.handleDateChange}
				/>
				<br/>
				Время:
				<input
					type="time"
					className="form-control"
					value={this.state["act.start.time"]}
					onChange={this.handleTimeChange}
				/>
				<br/>

				Занятие:<br/>
				<div className="btn-group" data-toggle="buttons">
				{typeNodes}
				</div>
				<br/><br/>

				Комментарий:
				<input
					type="text"
					className="form-control"
					value={this.state["act.comment"]}
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

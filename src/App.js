import * as React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  AppBar,
  Toolbar,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Stack,
  Card,
  CardHeader,
  CardContent,
  IconButton,
  Form,
  FormControl,
  InputLabel,
  Input,
  FormHelperText,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContentText,
  DialogContent,
  TextField,
  DesktopDatePicker,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import './style.css';

import toastr from 'toastr';
import 'toastr/build/toastr.min.css';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// import { AddCircle, IoMenu } from '@mui/icons-material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AddIcon from '@mui/icons-material/Add';
import MenuIcon from '@mui/icons-material/Menu';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import dayjs from 'dayjs';

export default function App() {
  const [showEditor, setShowEditor] = React.useState(false);

  const [taskDate, setTaskDate] = React.useState(null);

  const [taskDes, setTaskDes] = React.useState('');

  const [taskTitle, setTaskTitle] = React.useState('');

  const [taskPri, setTaskPri] = React.useState(null);

  const [isNew, setIsNew] = React.useState(true);

  const [titleError, setTitleError] = React.useState(false);

  const [desError, setDesError] = React.useState(false);

  const getPriority = (priotity) => {
    const priorities = { 0: 'Low', 1: 'Med', 2: 'High' };
    return priorities[priotity];
  };

  const openWindow = () => {
    setShowEditor(true);
  };

  const editTask = (task) => {
    setFields(task.title, task.description, task.deadline, task.priority);
    setIsNew(false);
    openWindow();
  };

  const setFields = (title, des, date, pri) => {
    setTaskTitle(title);
    setTaskDes(des);
    setTaskDate(date);
    setTaskPri(pri);
  };

  const clearErrors = () => {
    setDesError(false);
    setTitleError(false);
  };

  const closeWindow = () => {
    setShowEditor(false);
    setFields('', '', null, null);
    clearErrors();
    setIsNew(true);
  };

  const createData = (name, description, deadline, priority, isComplete) => {
    return { name, description, deadline, priority, isComplete };
  };

  const exportFields = () => {

    return {
      title: taskTitle,
      description: taskDes,
      deadline: taskDate,
      priority: taskPri,
      isComplete: false,
    };
  };

  const [tasks, setTasks] = React.useState([]);

  const ListRow = (props) => {
    return (
      <ListItem>
        <ListItemText primary={props.text} />
      </ListItem>
    );
  };

  const deleteItem = (titleToDelete) => {
    const newList = tasks.filter((task) => task.title !== titleToDelete);

    setTasks(newList);

    console.log('Item deleted');

    toastr.warning('Task deleted').show();
  };

  const validateInput = () => {
    var valid = true;

    clearErrors();

    if (taskDes == '') {
      setDesError(true);
      valid = false;
    }
    if (taskTitle == '') {
      setTitleError(true);
      valid = false;
    } else if (isNew && tasks.find((t) => t.title == taskTitle)) {
      setTitleError(true);
      valid = false;
    }

    return valid;
  };

  const toggleComplete = (titleToToggle) => {
    var task = tasks.find((t) => (t.title = titleToToggle));

    task.isComplete = !task.isComplete;
    console.log('update?');
  };

  const addOrUpdate = () => {
    if (!validateInput()) {
      return;
    }

    if (!isNew) {
      var task = tasks.find((t) => t.title == taskTitle);

      task.description = taskDes;
      task.deadline = taskDate;
      task.priority = taskPri;
      console.log(String(task));
      toastr.success('Task updated').show();
    } else {

      setTasks(tasks.concat(exportFields()));
      toastr.success('Task added').show();

    }

    closeWindow();
  };

  const AddButton = () => {
    return (
      <Stack direction="row">
        <Button variant="contained" onClick={openWindow}>
          <AddCircleIcon />
          Add
        </Button>
      </Stack>
    );
  };

  const MuiList = () => {
    return (
      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell align="right">Description</TableCell>
              <TableCell align="center">Deadline</TableCell>
              <TableCell align="right">Priority</TableCell>
              <TableCell align="center">Is Complete</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task) => (
              <ItemRow task={task} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const ItemRow = (props) => {
    const [complete, setComplete] = React.useState(props.task.isComplete);

    return (
      <TableRow
        key={props.task.taskTitle}
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
      >
        <TableCell component="th" scope="row">
          {props.task.title}
        </TableCell>
        <TableCell align="right">{props.task.description}</TableCell>
        <TableCell align="right">
          {props.task.deadline.format("MM/DD/YYYY")}
          </TableCell>

        <TableCell align="right">{getPriority(props.task.priority)}</TableCell>

        <TableCell align="center">
          <Checkbox
            checked={props.task.isComplete}
            onClick={() => {
              props.task.isComplete = !props.task.isComplete;
              console.log(props.task.isComplete);
              setComplete(!complete);
            }}
          />
        </TableCell>

        <TableCell align="center">
          <Stack spacing={1}>
            <Button
              variant="contained"
              color="error"
              onClick={() => deleteItem(props.task.title)}
            >
              <DeleteIcon />
              Delete
            </Button>

            {!props.task.isComplete && (
              <Button variant="contained" onClick={() => editTask(props.task)}>
                <EditIcon />
                Update
              </Button>
            )}
          </Stack>
        </TableCell>
      </TableRow>
    );
  };

  const updateDate = (newDate) => {
    setTaskDate(newDate);
  };

  const updatePri = (newPri) => {
    setTaskPri(newPri);
  };

  return (
    <div>
      <Dialog open={showEditor} onClose={closeWindow}>
        <DialogTitle>
          <Stack direction="row">
            {isNew && (
              <Stack direction="row">
                <AddCircleIcon />
                New&nbsp;
              </Stack>
            )}
            {!isNew && (
              <Stack direction="row">
                <EditIcon />
                Update&nbsp;
              </Stack>
            )}
            Task
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <TextField
              autoFocus
              error={titleError}
              helperText={titleError ? 'Invalid Title' : ''}
              disabled={!isNew}
              id="taskTitleField"
              label="Title"
              variant="outlined"
              value={taskTitle}
              style={{ marginTop: 10 }}
              onChange={(e) => setTaskTitle(e.target.value)}
            />

            <TextField
              error={desError}
              helperText={desError ? 'Invalid Description' : ''}
              id="Description"
              label="Description"
              variant="outlined"
              value={taskDes}
              onChange={(e) => setTaskDes(e.target.value)}
            />

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Deadline"
                id="Deadline"
                value={taskDate}
                onChange={(newDate) => setTaskDate(newDate)}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>

            <FormControl>
              <FormLabel> Priority </FormLabel>
              <RadioGroup
                row
                name="Radio Buttons"
                value={taskPri}
                onChange={(e) => {
                  setTaskPri(e.target.value);
                }}
              >
                <FormControlLabel value={0} control={<Radio />} label="Low" />
                <FormControlLabel value={1} control={<Radio />} label="Med" />
                <FormControlLabel value={2} control={<Radio />} label="High" />
              </RadioGroup>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={addOrUpdate}>
            <Stack direction="row">
              {isNew && (
                <Stack direction="row">
                  <AddIcon />
                  Add
                </Stack>
              )}
              {!isNew && (
                <Stack direction="row">
                  <EditIcon />
                  Update
                </Stack>
              )}
            </Stack>
          </Button>
          <Button onClick={closeWindow} color="error">
            <CloseIcon />
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Card>
        <CardHeader
          sx={{ backgroundColor: 'primary.dark', color: 'white' }}
          title={
            <Stack direction="row">
              <MenuIcon />
              FRAMEWORK
            </Stack>
          }
          color="white"
          action={<AddButton />}
          style={{ textAlign: 'center' }}
        >
          FRAMEWORK
        </CardHeader>

        <CardContent>
          <MuiList />
        </CardContent>
      </Card>
    </div>
  );
}

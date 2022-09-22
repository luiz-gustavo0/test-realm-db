import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { CustomModal } from './src/components/Modal';
import { getRealm } from './src/database/realm';

type TaskData = {
  _id: string;
  name: string;
  status: string;
  created_at: Date;
};

const App = () => {
  const [inputTask, setInputTask] = useState('');
  const [editTask, setEditTask] = useState('');
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  async function handleCreateTask() {
    const realm = await getRealm();

    try {
      if (inputTask === '') {
        return Alert.alert('Preencha com uma tarefa');
      }

      realm.write(() => {
        const created = realm.create('Task', {
          _id: Math.random().toString(36).slice(2),
          name: inputTask,
          status: 'open',
          created_at: new Date(),
        });

        console.log('CREATED =>', created);
      });
      setInputTask('');
      await getTasks();
    } catch (error) {
      console.log(error);
    }
  }

  async function handleDeleteTask(id: string) {
    const realm = await getRealm();

    try {
      const task = realm.objects<TaskData>('Task').filtered(`_id = '${id}'`)[0];

      realm.write(() => {
        realm.delete(task);
      });

      await getTasks();
    } catch (error) {
      console.log(error);
    }
  }

  async function getTasks() {
    const realm = await getRealm();

    try {
      const response = realm.objects<TaskData[]>('Task').toJSON();

      setTasks(response);
    } catch (error) {
      console.log(error);
    } finally {
      realm.close();
    }
  }

  useEffect(() => {
    getTasks();
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.sectionContainer}>
        <Text style={styles.title}>Criar uma nova tarefa</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="New task"
            value={inputTask}
            onChangeText={setInputTask}
          />
          <TouchableOpacity style={styles.button} onPress={handleCreateTask}>
            <Text style={styles.buttonText}>Salvar</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>Lista de tarefas</Text>
          <FlatList
            data={tasks}
            keyExtractor={item => item._id}
            renderItem={({ item }) => (
              <View style={styles.taskContainer}>
                <TouchableOpacity
                  style={styles.taskButton}
                  onPress={() => {
                    setModalVisible(true);
                    setEditTask(item.name);
                  }}>
                  <Text style={styles.taskText}>{item.name}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteTask(item._id)}>
                  <Text style={styles.buttonText}>Excluir</Text>
                </TouchableOpacity>
              </View>
            )}
            ListEmptyComponent={
              <View>
                <Text>A lista de tarefas está vazia</Text>
              </View>
            }
          />
        </View>
        <CustomModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}>
          <Text style={styles.title}>Editar Tarefa</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Editar task"
              value={editTask}
              onChangeText={setEditTask}
            />
            <TouchableOpacity style={styles.button} onPress={handleCreateTask}>
              <Text style={styles.buttonText}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </CustomModal>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    flex: 1,
    paddingVertical: 32,
    paddingHorizontal: 16,
  },

  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 24,
  },

  inputContainer: {
    width: '100%',
    marginBottom: 24,
    flexDirection: 'row',
  },

  input: {
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
    color: '#141414',
    width: '70%',
    marginRight: 8,
  },
  button: {
    borderRadius: 4,
    width: '29%',
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'blue',
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  content: {
    marginTop: 24,
  },
  taskContainer: {
    width: '100%',
    paddingVertical: 8,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },

  taskButton: {
    width: '75%',
    paddingVertical: 8,
  },
  taskText: {
    fontSize: 16,
  },
  deleteButton: {
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'red',
  },
});

export default App;

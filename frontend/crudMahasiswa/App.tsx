import React, { Component } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Text, TextInput, Button, Card, Title, Paragraph, Modal, Portal, Provider } from 'react-native-paper';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 40,
    backgroundColor: '#f7f7f7',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  card: {
    marginBottom: 10,
  },
  input: {
    marginBottom: 10,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  modalButton: {
    marginTop: 10,
  },
  addButton: {
    marginTop: 20,
  },
});

interface State {
  npm: string;
  nama: string;
  program_studi: string;
  alamat: string;
  listData: Array<any>;
  idEdit: number | null;
  isModalVisible: boolean;
}

class App extends Component<{}, State> {
  url: string;

  constructor(props: any) {
    super(props);
    this.state = {
      npm: '',
      nama: '',
      program_studi: '',
      alamat: '',
      listData: [],
      idEdit: null,
      isModalVisible: false,
    };
    this.url = "http://10.0.2.2:8080/api/backend/api.php";
  }

  componentDidMount() {
    this.ambilListData();
  }

  async ambilListData() {
    try {
      const response = await fetch(this.url);
      const json = await response.json();
      this.setState({ listData: json.data.result });
    } catch (error) {
      console.error(error);
    }
  }

  klikSimpan() {
    console.log('klikSimpan');
    if (!this.state.nama || !this.state.npm || !this.state.program_studi || !this.state.alamat) {
      Alert.alert('Error', 'Semua field wajib diisi!');
      return;
    }

    const urlAksi = this.state.idEdit
      ? `${this.url}?op=update&id=${this.state.idEdit}`
      : `${this.url}?op=create`;
    console.log('idEdit:', this.state.idEdit);
    console.log('urlAksi:', urlAksi);

    console.log('Data yang dikirim:', {
      nama: this.state.nama,
      npm: this.state.npm,
      program_studi: this.state.program_studi,
      alamat: this.state.alamat,
    });



    fetch(urlAksi, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `npm=${this.state.npm}&nama=${this.state.nama}&program_studi=${this.state.program_studi}&alamat=${this.state.alamat}`,
    })
      .then((response) => response.text()) // Ambil respons sebagai teks mentah
      .then((text) => {
        console.log('Respons dari server:', text); // Log respons mentah
        const json = JSON.parse(text); // Parse JSON
        if (json.status === 'success') {
          console.log('Data berhasil disimpan:', json);
          this.ambilListData();
          this.setState({
            nama: '',
            npm: '',
            program_studi: '',
            alamat: '',
            isModalVisible: false,
          });
        } else {
          console.error('Error:', json.message);
          Alert.alert('Error', json.message);
        }
      })
      .catch((error) => {
        console.error('Error saat menyimpan data:', error.message);
        Alert.alert('Error', 'Gagal menyimpan data! Pastikan server berjalan dengan baik.');
      });




  }

  async klikEdit(id: number) {
    try {
      const response = await fetch(`${this.url}?op=detail&id=${id}`);
      const json = await response.json();
      const data = json.data.result[0];
      this.setState({
        npm: data.npm,
        nama: data.nama,
        program_studi: data.program_studi,
        alamat: data.alamat,
        idEdit: id,
        isModalVisible: true,
      });
    } catch (error) {
      console.error(error);
    }
  }

  async klikDelete(id: number) {
    Alert.alert('Konfirmasi', 'Apakah Anda yakin ingin menghapus data ini?', [
      {
        text: 'Batal',
        style: 'cancel',
      },
      {
        text: 'Hapus',
        onPress: async () => {
          try {
            await fetch(`${this.url}?op=delete&id=${id}`);
            this.ambilListData();
          } catch (error) {
            console.error(error);
          }
        },
      },
    ]);
  }

  render() {
    return (
      <Provider>
        <Portal>
          <Modal visible={this.state.isModalVisible} onDismiss={() => this.setState({ isModalVisible: false })}>
            <View style={styles.modalContainer}>
              <TextInput
                label="NPM"
                value={this.state.npm}
                onChangeText={(text) => this.setState({ npm: text })}
                style={styles.input}
              />
              <TextInput
                label="Nama"
                value={this.state.nama}
                onChangeText={(text) => this.setState({ nama: text })}
                style={styles.input}
              />
              <TextInput
                label="Program Studi"
                value={this.state.program_studi}
                onChangeText={(text) => this.setState({ program_studi: text })}
                style={styles.input}
              />
              <TextInput
                label="Alamat"
                value={this.state.alamat}
                onChangeText={(text) => this.setState({ alamat: text })}
                style={styles.input}
              />
              <Button mode="contained" onPress={() => this.klikSimpan()} style={styles.modalButton}>
                Simpan
              </Button>
            </View>
          </Modal>
        </Portal>

        <View style={styles.container}>
          {/* Judul Aplikasi */}
          <Text style={styles.title}>API CRUD Mahasiswa</Text>

          {/* Daftar Data */}
          <FlatList
            data={this.state.listData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Card style={styles.card}>
                <Card.Content>
                  <Title>{item.npm} - {item.nama}</Title>
                  <Paragraph>Program Studi: {item.program_studi}</Paragraph>
                  <Paragraph>Alamat: {item.alamat}</Paragraph>
                </Card.Content>
                <Card.Actions>
                  <Button onPress={() => this.klikEdit(item.id)}>Edit</Button>
                  <Button onPress={() => this.klikDelete(item.id)} color="red">
                    Delete
                  </Button>
                </Card.Actions>
              </Card>
            )}
          />

          {/* Tombol Tambah Data */}
          <Button
            mode="contained"
            onPress={() => this.setState({ isModalVisible: true })}
            style={styles.addButton}
          >
            Tambah Data
          </Button>
        </View>
      </Provider>
    );
  }
}

export default App;

<?php

// Menambahkan header untuk mengizinkan CORS
header("Access-Control-Allow-Origin: *");  // Mengizinkan semua domain untuk mengakses resource ini
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");  // Metode HTTP yang diizinkan
header("Access-Control-Allow-Headers: Content-Type");  // Menentukan header yang diizinkan

// Jika permintaan adalah preflight (OPTIONS request), langsung beri respons tanpa melanjutkan eksekusi
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
  http_response_code(200);  // Kode status untuk preflight request
  exit();
}


error_reporting(0);

$host = "localhost";
$user = "root";
$password = "Donat66";
$db_name = "api_rn";

$koneksi = mysqli_connect($host, $user, $password, $db_name);
if (!$koneksi) {
    die("Koneksi gagal: " . mysqli_connect_error());
}


$op = $_GET['op'];
switch ($op) {
  case '':
    normal();
    break;
  default:
    normal();
    break;
  case 'create':
    create();
    break;
  case 'detail':
    detail();
    break;
  case 'update':
    update();
    break;
  case 'delete':
    delete();
    break;
}


function normal()
{
  global $koneksi;
  $sql1 = "select * from mahasiswa order by id desc";
  $q1 = mysqli_query($koneksi, $sql1);
  while ($rl = mysqli_fetch_array($q1)) {
    $hasil[] = array(
      'id' => $rl['id'],
      'npm' => $rl['npm'],
      'nama' => $rl['nama'],
      'program_studi' => $rl['program_studi'],
      'alamat' => $rl['alamat'],
      'tanggal_input' => $rl['tanggal_input']
    );
  }
  $data['data']['result'] = $hasil;
  echo json_encode($data);
}

function create() {
  global $koneksi;
  
  // Log untuk melihat data POST yang diterima
  error_log("Data POST diterima: " . json_encode($_POST));

  $npm = $_POST['npm'];
  $nama = $_POST['nama'];
  $alamat = $_POST['alamat'];
  $program_studi = $_POST['program_studi'];

  if ($nama && $npm && $program_studi) {
    $sql1 = "INSERT INTO mahasiswa (npm, nama, program_studi, alamat, tanggal_input) 
         VALUES ('$npm', '$nama', '$program_studi', '$alamat', NOW())";
    $q1 = mysqli_query($koneksi, $sql1);
    if ($q1) {
      $hasil = "Berhasil menambahkan data";
    } else {
      $hasil = "Gagal menambahkan data";
    }
  } else {
    $hasil = "Gagal dimasukkan data";
  }

  $data['data']['result'] = $hasil;


  echo json_encode($data);
}


function detail()
{
  global $koneksi;
  $id = $_GET['id'];
  $sql1 = "select * from mahasiswa where id = '$id'";
  $q1 = mysqli_query($koneksi, $sql1);
  while ($r1 = mysqli_fetch_array($q1)) {
    $hasil[] = array(
      'id' => $r1['id'],
      'npm' => $r1['npm'],
      'nama' => $r1['nama'],
      'program_studi' => $r1['program_studi'],
      'alamat' => $r1['alamat'],
      'tanggal_input' => $r1['tanggal_input']
    );
  }
  $data['data']['result'] = $hasil;
  echo json_encode($data);
}


function update()
{
  global $koneksi;
  $id = $_GET['id'];
  $npm = $_POST['npm'];
  $nama = $_POST['nama'];
  $program_studi = $_POST['program_studi'];
  $alamat = $_POST['alamat'];
  $tanggal_input = $_POST['tanggal_input'];
  if ($npm) {
    $set[] = "npm='$npm'";
  }
  if ($nama) {
    $set[] = "nama='$nama'";
  }
  if ($program_studi) {
    $set[] = "program_studi='$program_studi'";
  }
  if ($alamat) {
    $set[] = "alamat='$alamat'";
  }
  $hasil = "Gagal melakukan update data";
  if ($nama or $alamat or $npm or $program_studi) {
    $sql1 = "update mahasiswa set " . implode(",", $set) . ",tanggal_input=now() where id = '$id'";
    $q1 = mysqli_query($koneksi, $sql1);
    if ($q1) {
      $hasil = "Data berhasil diupdate";
    }
  }
  $data['data']['result'] = $hasil;
  echo json_encode($data);
}

function delete()
{
  global $koneksi;
  $id = $_GET['id'];
  $sql1 = "delete from mahasiswa where id = '$id'";
  $q1 = mysqli_query($koneksi, $sql1);
  if ($q1) {
    $hasil = "Berhasil menghapus data";
  } else {
    $hasil = "Gagal menghapus data";
  }
  $data['data']['result'] = $hasil;
  echo json_encode($data);
}

error_reporting(E_ALL);
ini_set('display_errors', 1);

error_log('Data POST diterima: ' . json_encode($_POST));
error_log("Data POST diterima: " . json_encode($_POST));
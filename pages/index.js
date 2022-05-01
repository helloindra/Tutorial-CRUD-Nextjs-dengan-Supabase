import { useState, useEffect } from "react"
import { supabase } from "../utils/supabaseClient"
const arrayData = [
  {
    id: 1,
    judul: "Judul 1",
    konten: "Konten 1",
  },
  {
    id: 2,
    judul: "Judul 2",
    konten: "Konten 2",
  },
  {
    id: 3,
    judul: "Judul 3",
    konten: "Konten 3",
  },
]

export default function Home() {
  const [data, setData] = useState([])
  const [isEdit, setIsEdit] = useState(9999)

  const [inputedData, setInputedData] = useState({
    id: 4,
    judul: "",
    konten: "",
  })
  const [editedData, setEditedData] = useState({
    judul: "",
    konten: "",
  })

  useEffect(() => {
    handleReadData()
  }, [])

  const handleReadData = async () => {
    //proses fetching data dari supabase
    const { data, error } = await supabase.from("note").select("*")
    setData(data)
  }

  const handleInputChange = (e) => {
    //proses rubah input data ke state InputedData
    if (e.target.name === "judul") {
      setInputedData({
        ...inputedData,
        judul: e.target.value,
      })
    }
    if (e.target.name === "konten") {
      setInputedData({
        ...inputedData,
        konten: e.target.value,
      })
    }
  }

  const handleAddData = async () => {
    //proses menambahkan data ke supabase
    const { data, error } = await supabase.from("note").insert([
      {
        judul: inputedData.judul,
        konten: inputedData.konten,
      },
    ])
    console.log(data, error)
    handleReadData()
  }

  const handleDeleteData = async (id) => {
    //proses menghapus data dari supabase
    const { data, error } = await supabase.from("note").delete().eq("id", id)
    console.log(data)
    //proses fetching data ulang dari supabase
    handleReadData()
  }

  const handleEditData = (id) => {
    //rubah isEdit variable dengan id data.
    setIsEdit(id)
  }

  const handleChangeData = (event) => {
    //rubah existing data ke editedData
    if (event.target.name === "editjudul") {
      setEditedData({ ...editedData, judul: event.target.value })
    }
    if (event.target.name === "editkonten") {
      setEditedData({ ...editedData, konten: event.target.value })
    }
  }

  const handleUpdateData = async (id) => {
    //proses update data ke supabase berdasarkan editedData
    const { data, error } = await supabase
      .from("note")
      .update({ judul: editedData.judul, konten: editedData.konten })
      .match({ id: id })
    console.log(data, error)
    //penggantian variable isEdit untuk hide Input
    setIsEdit(9999)
    //proses fetching data ulang dari supabase
    handleReadData()
  }

  return (
    <div className="flex h-screen w-full justify-center items-center">
      <div className="space-y-2">
        <h1>NextCrud</h1>
        <p>Aplikasi sederhana belajar CRUD dengan Nextjs dan Supabase</p>
        <div className="flex flex-col gap-4">
          <input name="judul" onChange={handleInputChange} type="text" placeholder="Judul" />
          <input name="konten" onChange={handleInputChange} type="text" placeholder="Konten" />
        </div>
        <button onClick={handleAddData}>Add Data</button>
        <section>
          {data.map(({ id, judul, konten }, index) => {
            return (
              <div key={id} className="my-12">
                {isEdit === index ? (
                  <div className="flex flex-col gap-4">
                    <input
                      name="editjudul"
                      onChange={(event) => handleChangeData(event, index)}
                      defaultValue={judul}
                      type="text"
                    />
                    <input
                      name="editkonten"
                      onChange={(event) => handleChangeData(event, index)}
                      defaultValue={konten}
                      type="text"
                    />
                  </div>
                ) : (
                  <>
                    <h3>{judul}</h3>
                    <p>{konten}</p>
                  </>
                )}
                <button onClick={() => handleUpdateData(id)}>Update</button>
                <button onClick={() => handleEditData(index)}>Edit</button>
                <button onClick={() => handleDeleteData(id)}>Delete</button>
              </div>
            )
          })}
        </section>
      </div>
    </div>
  )
}

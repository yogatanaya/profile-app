import React, { useEffect, useState } from 'react';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import {  collection, addDoc, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { storage, db } from '../Firebase';
import { useNavigate, useParams } from 'react-router-dom';

import {
  DocumentCard,
  DocumentCardDetails
} from '@fluentui/react/lib/DocumentCard';
import { Label } from '@fluentui/react/lib/Label';
import { TextField } from '@fluentui/react/lib/TextField';
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import { initializeIcons } from '@fluentui/font-icons-mdl2';
import { Spinner } from '@fluentui/react';

export default function EditCandidate() {

  initializeIcons();

  let navigate = useNavigate();
  const { id, image_url } = useParams();
  
  const [ candidate, setCandidate ] = useState(null);
  const [ progress, setProgress ] = useState(0)
  
  const [ name, setName ] = useState("");
  const [ age, setAge ] = useState("");
  const [ imageUrl, setImageUrl ] = useState("");

  const routeBack = () => {
    let path = `/`;
    navigate(path);
  }

  useEffect(() => {
    const docRef = doc(db, "candidates", id);
    onSnapshot(docRef, (snapshot) => {
      setCandidate({
        ...snapshot.data(),
        id: snapshot.id
      });
    })
  }, []);

  const handleSave = (paramId, paramName, paramAge, paramImgUrl) => {
    const storageRef = ref(storage, `profiles/${Date.now()}${paramImgUrl.name}`);
    const uploadImage = uploadBytesResumable(storageRef, paramImgUrl);
    uploadImage.on("state_changed", 
      (snapshot) => {
        const progressPercents = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        )
        setProgress(progressPercents);
      }, 
      (err) => {
        console.log(err);
      },
      () => {
        getDownloadURL(uploadImage.snapshot.ref)
        .then((url) => {
          const candidateRef = doc(db, "candidates", paramId);
          updateDoc(candidateRef, {
            name: paramName,
            age: paramAge,
            image_url: url
          })
          .then(() => {
            alert('updated successfully!');
            setProgress(0)
          })
          .catch(err => {
            alert(err);
          }) 
        })
      }
    )
  }

  return (
    <DocumentCard style={{ padding: '22px' }}>
      {
        progress === 0 ? null : (
          <Spinner size={Spinner.large} label={`progress uploading... ${progress}`}/>
        )
      }
      { candidate && (

      <DocumentCardDetails>
        <form className='add-experiences'>
          <TextField label="Name" name='name' placeholder={candidate.name} onChange={(e) => setName(e.target.value)} />
          <TextField label="Age" name='age' placeholder={candidate.age} onChange={(e) => setAge(e.target.value)} />

          <Label disabled>User Profile Picture</Label>

          <input type="file" name="image_url" accept='image/*' onChange={(e) => setImageUrl(e.target.files[0])}/>
          
          <div style={{ marginTop: '22px' }}>
            <PrimaryButton text='Save' onClick={() => handleSave(candidate.id, name, age, imageUrl)}/>
            {" "}
            <DefaultButton text='Cancel' onClick={routeBack}/>
          </div>
         
        </form>
      </DocumentCardDetails>
      
      )}

    </DocumentCard>
  )
}
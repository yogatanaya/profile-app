import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { db } from '../Firebase';
import ExperienceList from './ExperienceList';

// fluent ui
import {
  DocumentCard,
  DocumentCardDetails
} from '@fluentui/react/lib/DocumentCard';
import { Stack } from '@fluentui/react/lib/Stack';
import { Label } from '@fluentui/react/lib/Label';
import { Separator } from '@fluentui/react/lib/Separator';
import { Image } from '@fluentui/react/lib/Image';
import { Text } from '@fluentui/react/lib/Text';
import { Spinner, SpinnerSize } from '@fluentui/react/lib/Spinner';
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import AddExperience from './AddExperience';

export default function CandidateList() {
  
  const [candidates, setCandidates] = useState([]);
  let navigate = useNavigate();

  const routeChange = () => {
    let path = `/add-experiences`;
    navigate(path);
  }

  useEffect(() => {
    let candidatesRef = collection(db, "candidates");
    let q = query(candidatesRef, orderBy("name", "desc"));
    onSnapshot(q, (snapshot) => {
      let candidates = snapshot.docs.map((doc) => ({
        id: doc.id, 
        ...doc.data()
      }))
      setCandidates(candidates);
    })
  }, []);

  const handleEdit = (paramId, paramImgUrl) => {
    navigate(`/edit-candidate/${paramId}`, {id: paramId, image_url: paramImgUrl});
  }

  return (
    <div>
      {
        candidates.length === 0 ? (
          <Spinner size={SpinnerSize.large} />
        ) : (
          <Stack>
            {
              candidates.map(({ id, name, age, image_url }) => 

                <DocumentCard key={id} aria-label={name} style={{ padding: '22px' }}>

                  <DocumentCardDetails>
                    <Image src={image_url} alt={name} 
                    style={{ borderRadius: '30px', width: '80%' }}
                    />
                    

                    <Separator>Personal Information</Separator>
                    <PrimaryButton text="Edit Personal Data" onClick={() => handleEdit(id, image_url)}/>

                    <Label disabled>Name</Label>
                    <Text variant='medium'>
                    {name ?? "-"}
                    </Text>
                    <Label disabled>Age</Label>
                    <Text variant='medium'>
                    {age ?? "-"}
                    </Text>

                    <Separator>Work Experiences</Separator>
                    <PrimaryButton text="Add Skills Experiences+" onClick={routeChange}/>

                    <ExperienceList/>

                  </DocumentCardDetails>
                
                </DocumentCard>
              )
            }
          </Stack>
        )
      }
    </div>
  )
}
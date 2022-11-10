import React, { Dispatch, SetStateAction } from "react"
import styled from "styled-components"
import { useState, useRef, useEffect, useMemo, useContext } from "react"
import algoliasearch from "algoliasearch/lite"
import {
  AutocompleteOptions,
  AutocompleteState,
  createAutocomplete,
} from "@algolia/autocomplete-core"
import { getAlgoliaResults } from "@algolia/autocomplete-preset-algolia"
import { Hit } from "@algolia/client-search"
import queryFriendImg from "../assets/034961magnifying-friends.png"
import { db } from "../Utils/firebase"
import { getDoc, doc, setDoc } from "firebase/firestore"
import { DocumentData } from "@firebase/firestore-types"
import { AuthContext } from "../Context/authContext"

const InputWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  margin: 0;
  margin-bottom: 5px;
  padding: 0;
  align-items: center;
  gap: 8px;
`
const QueryForm = styled.form``
const QueryFriendInput = styled.input`
  display: flex;
  flex: 1 1 auto;
  padding-left: 22px;
  width: 70%;
  font-size: 16px;
  line-height: 24px;
  height: 24px;
  &:focus {
    color: #034961;
    outline: 1px solid #fbcb63;
    border: none;
    border-radius: 5px;
  }
  ::placeholder {
    font-size: 12px;
  }
`
const QueryIconWrapper = styled.div`
  position: relative;
  display: flex;
  min-width: 22px;
  line-height: 22px;
  height: 22px;
  border-radius: 5px;
`
const Label = styled.label``
const BtnQueryIcon = styled.button`
  position: absolute;
  top: 3px;
  left: 3px;
  width: 18px;
  height: 18px;
  border: none;
  border-radius: 5px;
  background-image: url(${queryFriendImg});
  background-size: contain;
`

const ResultsSection = styled.div`
  display: flex;
  flex-flow: column wrap;
  padding: 5px;
  margin-bottom: 20px;
  border: 1px solid #cfcfcf;
`
const Section = styled.section`
  font-size: 16px;
`

const ResultContentWrapper = styled.div`
  padding-bottom: 10px;
  &:hover {
    padding-left: 5px;
    background-color: #e6e6e6;
    border-radius: 5px;
  }
`
const ResultContent = styled(ResultContentWrapper)`
  padding: 5px 0;
  font-family: "Poppins";
  line-height: 16px;
  height: 16px;
  font-size: 14px;
  cursor: pointer;
`
export const FilteredWrapper = styled.div`
  position: relative;
  display: flex;
  flex-flow: row nowrap;
  width: 100%;
  line-height: 16px;
  height: 16px;
  margin-top: 10px;
  margin-bottom: 20px;
`
export const FilteredContent = styled.div`
  margin: 2px;
  align-self: center;
  font-family: "Poppins";
  line-height: 16px;
  height: 16px;
  font-size: 12px;
`
export const UserAvatar = styled.img`
  width: 16px;
  height: 16px;
`

export const BtnDefault = styled.div`
  position: absolute;
  right: 5px;
  padding: 1px 5px;
  align-self: center;
  font-family: "Poppins";
  line-height: 16px;
  height: 16px;
  font-size: 12px;
  color: #ffffff;
  background-color: #3490ca;
  border-radius: 3px;
  cursor: pointer;
`
export const BtnWrapper = styled.div`
  position: relative;
  display: flex;
  flex-flow: row nowrap;
  margin-top: 10px;
  margin-bottom: 20px;
  width: 10%;
  height: 16px;
  line-height: 16px;
  font-size: 12px;
  gap: 10px;
`

export const BtnAccept = styled.div`
  width: 48%;
  text-align: center;
  font-family: "Poppins";
  font-size: 12px;
  color: #ffffff;
  background-color: #34ca9d;
  border-radius: 3px;
  cursor: pointer;
`
export const BtnDeny = styled(BtnAccept)`
  background-color: #ca3434;
`

const searchClient = algoliasearch(
  "NW2MT84M3G",
  "f31f1435408c2dda975160ac96a5e625"
)
type AutocompleteItem = Hit<{
  name: string
}>

interface Props extends Partial<AutocompleteOptions<AutocompleteItem>> {
  qResultIds: string[]
  setQResultIds: Dispatch<SetStateAction<string[]>>
  invitingIds: string[]
}
interface UserInfoType {
  id: string | DocumentData
  name: string | DocumentData
  email: string | DocumentData
  photoURL: string | DocumentData
  hometownName: string
  hometownLat: number
  hometownLng: number
}

export function Autocomplete(props: Props) {
  const { currentUser, isLogin } = useContext(AuthContext)
  const [filteredId, setFilteredId] = useState("")
  const [queryResult, setQueryResult] = useState<DocumentData | UserInfoType>()
  const [friendStatus, setFriendStatus] = useState("")
  console.log("friendStatus", friendStatus)
  const [autocompleteState, setAutocompleteState] = useState<
    AutocompleteState<AutocompleteItem>
  >({
    collections: [],
    completion: null,
    context: {},
    isOpen: false,
    query: "",
    activeItemId: null,
    status: "idle",
  })

  const autocomplete = useMemo(
    () =>
      createAutocomplete<
        AutocompleteItem,
        React.BaseSyntheticEvent,
        React.MouseEvent,
        React.KeyboardEvent
      >({
        onStateChange({ state }) {
          setAutocompleteState(state)
        },
        getSources() {
          return [
            {
              sourceId: "users_myTravelPins",
              getItems({ query }) {
                return getAlgoliaResults({
                  searchClient,
                  queries: [
                    {
                      indexName: "users_myTravelPins",
                      query,
                      params: {
                        hitsPerPage: 10,
                      },
                    },
                  ],
                })
              },
            },
          ]
        },
        ...props,
      }),
    [props]
  )
  const formRef = useRef<HTMLFormElement>(null)
  const qInputRef = useRef<HTMLInputElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const { getEnvironmentProps } = autocomplete

  // console.log("autocompleteState", autocompleteState)
  // console.log("props.qResultIds", props.qResultIds)
  // console.log("qInputRef.current.value", qInputRef?.current?.value)
  // console.log("filteredId", filteredId)
  // console.log("queryResult", queryResult)
  const checkRelation = async (id: string) => {
    if (!isLogin || currentUser === null) return
    const inviterIsMedocRef = doc(
      db,
      "relationships",
      `${currentUser?.id}${id}`
    )
    const receiverIsMeDocRef = doc(
      db,
      "relationships",
      `${id}${currentUser?.id}`
    )
    const friendDocRef = doc(db, "users", `${currentUser?.id}`)
    const friendDocSnap = await getDoc(friendDocRef)
    const inviterIsMeDocSnap = await getDoc(inviterIsMedocRef)
    const receiverIsMeDocSnap = await getDoc(receiverIsMeDocRef)
    if (friendDocSnap.exists() && friendDocSnap.data().friends?.includes(id)) {
      setFriendStatus("alreadyFriend")
      return
    } else if (
      inviterIsMeDocSnap.exists() &&
      inviterIsMeDocSnap.data().status === "pending"
    ) {
      setFriendStatus("awaitingReply")
      return
    } else if (
      receiverIsMeDocSnap.exists() &&
      receiverIsMeDocSnap.data().status === "pending"
    ) {
      setFriendStatus("acceptOrDeny")
      return
    } else {
      console.log("No such document!")
      setFriendStatus("")
      return
    }
  }
  const getQueryResult = async (id: string) => {
    try {
      const docRef = doc(db, "users", id)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data())
        setQueryResult(docSnap.data())
      }
    } catch (error) {
      console.log(error)
    }
  }
  const addFriend = async (id: string) => {
    if (!isLogin || currentUser === null) return
    try {
      const addRef = doc(db, "relationships", `${currentUser?.id}${id}`)
      await setDoc(addRef, {
        inviter: currentUser?.id,
        receiver: id,
        status: "pending",
      })
      setFriendStatus("awaitingReply")
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (!formRef.current || !panelRef.current || !qInputRef.current) {
      return undefined
    }

    const { onTouchStart, onTouchMove } = getEnvironmentProps({
      formElement: formRef.current,
      inputElement: qInputRef.current,
      panelElement: panelRef.current,
    })

    window.addEventListener("touchstart", onTouchStart)
    window.addEventListener("touchmove", onTouchMove)

    return () => {
      window.removeEventListener("touchstart", onTouchStart)
      window.removeEventListener("touchmove", onTouchMove)
    }
  }, [getEnvironmentProps, formRef, qInputRef, panelRef])

  return (
    <>
      <InputWrapper {...autocomplete.getRootProps({})}>
        <QueryForm
          ref={formRef}
          {...autocomplete.getFormProps({ inputElement: qInputRef.current })}
        >
          <QueryIconWrapper>
            <Label>
              <BtnQueryIcon type="submit" {...autocomplete.getLabelProps()} />
            </Label>
            <QueryFriendInput
              ref={autocompleteState.isOpen ? qInputRef : null}
              {...autocomplete.getInputProps({
                inputElement: qInputRef.current,
                placeholder: "Search a friend",
              })}
            />
          </QueryIconWrapper>
        </QueryForm>
      </InputWrapper>
      {autocompleteState.isOpen && (
        <ResultsSection ref={panelRef} {...autocomplete.getPanelProps({})}>
          {autocompleteState.collections.map((collection, index) => {
            const { source, items } = collection
            return (
              <Section key={`source-${index}`} {...autocomplete.getListProps()}>
                {items.length > 0 &&
                  items.map((item) => {
                    return (
                      <ResultContentWrapper key={item.objectID}>
                        <ResultContent
                          {...autocomplete.getItemProps({ item, source })}
                          onClick={() => {
                            setAutocompleteState({
                              ...autocompleteState,
                              isOpen: false,
                            })
                            getQueryResult(item.objectID)
                            checkRelation(item.objectID)
                          }}
                        >
                          {item.name}
                        </ResultContent>
                      </ResultContentWrapper>
                    )
                  })}
              </Section>
            )
          })}
        </ResultsSection>
      )}
      {queryResult && !props.invitingIds.includes(queryResult.id) ? (
        <FilteredWrapper>
          <UserAvatar src={queryResult.photoURL} />
          <FilteredContent>{queryResult.name}</FilteredContent>
          <FilteredContent>{queryResult.hometownName}</FilteredContent>
          {friendStatus === "" ? (
            <BtnDefault
              onClick={() => {
                addFriend(queryResult.id)
              }}
            >
              Add friend
            </BtnDefault>
          ) : (
            ""
          )}
          {friendStatus === "acceptOrDeny" ? (
            <BtnWrapper>
              <BtnAccept>Accept</BtnAccept>
              <BtnDeny>Deny</BtnDeny>
            </BtnWrapper>
          ) : (
            ""
          )}
          {friendStatus === "alreadyFriend" ? (
            <BtnDefault>Visit friend</BtnDefault>
          ) : (
            ""
          )}
          {friendStatus === "awaitingReply" ? (
            <FilteredContent>Awaiting reply</FilteredContent>
          ) : (
            ""
          )}
        </FilteredWrapper>
      ) : (
        ""
      )}
    </>
  )
}

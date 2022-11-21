import React, {
  Dispatch,
  SetStateAction,
  useState,
  useRef,
  useEffect,
  useMemo,
  useContext,
} from "react"
import styled from "styled-components"
import { getDoc, doc, setDoc } from "firebase/firestore"
import { DocumentData } from "@firebase/firestore-types"
import algoliasearch from "algoliasearch/lite"
import {
  AutocompleteOptions,
  AutocompleteState,
  createAutocomplete,
} from "@algolia/autocomplete-core"
import { getAlgoliaResults } from "@algolia/autocomplete-preset-algolia"
import { Hit } from "@algolia/client-search"
import { db } from "./firebase"
import { AuthContext } from "../Context/authContext"
import queryFriendImg from "../assets/034961magnifying-friends.png"

/* eslint-disable react/jsx-props-no-spreading */

const InputWrapper = styled.div`
  display: flex;
  flex-flow: column wrap;
  height: 4;
  line-height: 40px;
  margin: 15px 10px;
  padding: 0;
  align-items: center;
  gap: 8px;
  @media screen and (max-width: 900px) and (min-width: 600px),
    (max-height: 600px) {
    line-height: 30px;
    height: 30px;
  }
`
const QueryForm = styled.form`
  width: 100%;
`
const QueryFriendInput = styled.input`
  display: flex;
  flex: 1 1 auto;
  padding-left: 40px;
  width: 100%;
  font-size: 24px;
  line-height: 40px;
  height: 40px;
  border-radius: 5px;
  &:focus {
    color: #034961;
    outline: 3px solid #fbcb63;
    border: none;
  }
  ::placeholder {
    font-size: 12px;
  }
  @media screen and (max-width: 900px) and (min-width: 600px),
    (max-height: 600px) {
    padding-left: 32px;
    line-height: 30px;
    height: 30px;
  }
`
const QueryIconWrapper = styled.div`
  position: relative;
  display: flex;
  min-width: 22px;
  line-height: 40px;
  height: 40px;
  border-radius: 5px;
  @media screen and (max-width: 900px) and (min-width: 600px),
    (max-height: 600px) {
    line-height: 30px;
    height: 30px;
  }
`
const Label = styled.label``
const BtnQueryIcon = styled.button`
  position: absolute;
  top: 3px;
  left: 3px;
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 5px;
  background-image: url(${queryFriendImg});
  background-size: contain;
  @media screen and (max-width: 900px) and (min-width: 600px),
    (max-height: 600px) {
    top: 3px;
    left: 3px;
    width: 24px;
    height: 24px;
  }
`

const ResultsSection = styled.div`
  position: absolute;
  top: 65px;
  left: 0px;
  display: flex;
  flex-flow: column wrap;
  width: 100%;
  padding: 5px 25px;
  margin-bottom: 20px;
  background-color: #fff;
  z-index: 20;
  @media screen and (max-width: 900px) and (min-width: 600px),
    (max-height: 600px) {
    top: 55px;
  }
`
const Section = styled.section`
  font-size: 16px;
`

const ResultContentWrapper = styled.div`
  &:hover {
    padding-left: 5px;
    background-color: #e6e6e6;
    border: none;
    border-radius: 5px;
  }
`
const ResultContent = styled(ResultContentWrapper)`
  padding: 10px 0;
  font-family: "Poppins";
  line-height: 16px;
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
  invitingIds?: string[]
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
    } else if (
      inviterIsMeDocSnap.exists() &&
      inviterIsMeDocSnap.data().status === "pending"
    ) {
      setFriendStatus("awaitingReply")
    } else if (
      receiverIsMeDocSnap.exists() &&
      receiverIsMeDocSnap.data().status === "pending"
    ) {
      setFriendStatus("acceptOrDeny")
    } else {
      console.log("No such document!")
      setFriendStatus("")
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

  console.log(
    "aaaa",
    autocomplete.getInputProps({
      inputElement: qInputRef.current,
      placeholder: "Search a friend",
    })
  )

  const [clear, setClear] = useState("")

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
              ref={qInputRef}
              {...autocomplete.getInputProps({
                inputElement: null,
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
                      <ResultContentWrapper
                        key={item.objectID}
                        {...autocomplete.getInputProps({
                          inputElement: null,
                        })}
                        onClick={() => {
                          getQueryResult(item.objectID)
                          checkRelation(item.objectID)
                          setAutocompleteState({
                            ...autocompleteState,
                            isOpen: false,
                          })
                          if (
                            qInputRef?.current?.value &&
                            qInputRef?.current?.value.length !== 0
                          )
                            qInputRef.current.value = ""
                        }}
                      >
                        <ResultContent
                          {...autocomplete.getItemProps({ item, source })}
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
      {queryResult &&
      props.invitingIds !== undefined &&
      !props.invitingIds.includes(queryResult.id) ? (
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

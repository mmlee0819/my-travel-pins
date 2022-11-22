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
  margin: 15px 5px;
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
  font-size: 20px;
  line-height: 40px;
  height: 40px;
  border-radius: 5px;
  border: 1px solid #8c8c8c;
  &:focus {
    color: #034961;
    outline: 3px solid #fbcb63;
    border: none;
  }
  ::placeholder {
    font-size: 16px;
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
  top: 5px;
  left: 5px;
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 5px;
  background-image: url(${queryFriendImg});
  background-size: contain;
  @media screen and (max-width: 900px) and (min-width: 600px),
    (max-height: 600px) {
    top: 3px;
    left: 4px;
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
  margin-top: 15px;
  padding: 5px 15px;
  color: #2d2d2d;
  background-color: #e6e6e6;
  border-top: none;
  z-index: 20;
  @media screen and (max-width: 900px) and (min-width: 600px),
    (max-height: 600px) {
    top: 55px;
  }
`
const Section = styled.section`
  font-size: 20px;
`

const ResultContentWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 5px;
  font-family: "Poppins";
  font-size: 20px;
  &:hover {
    padding-left: 5px;
    padding-right: 10px;
    color: #e6e6e6;
    background-color: #2d2d2d;
    border: none;
    border-radius: 5px;
  }
  @media screen and (max-width: 900px) and (min-width: 600px),
    (max-height: 600px) {
    font-size: 18px;
  }
`
const Avatar = styled.img`
  margin: 0 10px 0 10px;
  width: 24px;
  height: 24px;
  @media screen and (max-width: 900px) and (min-width: 600px),
    (max-height: 600px) {
    width: 20px;
    height: 20px;
  }
`
const NameText = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: start;
  width: 30%;
  margin: 2px 10px 2px 0px;
  line-height: 24px;
  height: 24px;
  font-family: "Poppins";
  font-size: 20px;
  @media screen and (max-width: 900px) and (min-width: 600px),
    (max-height: 600px) {
    font-size: 16px;
    line-height: 20px;
    height: 20px;
  }
`
const NoMatchText = styled(NameText)`
  width: 100%;
  padding-left: 10px;
  line-height: 30px;
  height: 30px;
  font-weight: 700;
  @media screen and (max-width: 900px) and (min-width: 600px),
    (max-height: 600px) {
    line-height: 24px;
    height: 24px;
  }
`
const ResultContent = styled(ResultContentWrapper)`
  display: flex;
  align-items: center;

  padding: 10px 0;
  font-family: "Poppins";
  line-height: 16px;
  font-size: 14px;
  gap: 20px;
  cursor: pointer;
`
const FilteredWrapper = styled.div`
  position: relative;
  display: flex;
  flex-flow: row nowrap;
  width: 100%;
  margin: 10px 0;
  font-size: 20px;
  @media screen and (max-width: 900px) and (min-width: 600px),
    (max-height: 600px) {
    font-size: 16px;
  }
`

const FilteredContent = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  margin: 2px;
  line-height: 24px;
  height: 24px;
  font-family: "Poppins";
  font-size: 20px;
  @media screen and (max-width: 900px) and (min-width: 600px),
    (max-height: 600px) {
    font-size: 16px;
    line-height: 20px;
    height: 20px;
  }
`

export const UserAvatar = styled.img`
  width: 30px;
  height: 30px;
`

export const BtnDefault = styled.div`
  position: absolute;
  right: 5px;
  padding: 1px 5px;
  align-self: center;
  font-family: "Poppins";
  line-height: 30px;
  height: 30px;
  font-size: 20px;
  color: #ffffff;
  background-color: #3490ca;
  border-radius: 3px;
  cursor: pointer;
`
const BtnWrapper = styled.div`
  display: flex;
  flex: 1 1 auto;
  min-width: 35%;
  margin-right: 10px;
  justify-content: space-between;
  align-self: center;
`
const BtnAccept = styled.div`
  display: flex;
  width: 48%;
  justify-content: center;
  font-family: "Poppins";
  color: #ffffff;
  background-color: #34ca9d;
  border-radius: 3px;
  cursor: pointer;
`
const BtnDeny = styled(BtnAccept)`
  background-color: #ca3434;
`
const BtnVisitLink = styled(BtnAccept)`
  width: 100%;
  margin-right: 0px;
  background-color: #3490ca;
  text-decoration: none;
`
const searchClient = algoliasearch(
  "NW2MT84M3G",
  "f31f1435408c2dda975160ac96a5e625"
)
type AutocompleteItem = Hit<{
  id: string
  name: string
  photoURL: string
  email: string
  hometownName: string
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
              placeholder="Search user"
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
                    console.log({ item })
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
                          <Avatar src={item?.photoURL} />
                          {item.name}
                        </ResultContent>
                        {item.hometownName}
                      </ResultContentWrapper>
                    )
                  })}
              </Section>
            )
          })}
        </ResultsSection>
      )}
      {!autocompleteState.isOpen && qInputRef?.current?.value !== "" && (
        <ResultsSection>
          <NoMatchText>No matches found</NoMatchText>
        </ResultsSection>
      )}
      {queryResult &&
        props.invitingIds !== undefined &&
        !props.invitingIds.includes(queryResult.id) && (
          <FilteredWrapper>
            <Avatar src={queryResult.photoURL} />
            <NameText>{queryResult.name}</NameText>
            <NameText>{queryResult.hometownName}</NameText>
            {friendStatus === "" && (
              <BtnVisitLink
                onClick={() => {
                  addFriend(queryResult.id)
                }}
              >
                Add friend
              </BtnVisitLink>
            )}
            {friendStatus === "acceptOrDeny" && (
              <BtnWrapper>
                <BtnAccept>Accept</BtnAccept>
                <BtnDeny>Deny</BtnDeny>
              </BtnWrapper>
            )}
            {friendStatus === "alreadyFriend" && (
              <BtnWrapper>
                <BtnVisitLink>Visit friend</BtnVisitLink>
              </BtnWrapper>
            )}
            {friendStatus === "awaitingReply" && (
              <FilteredContent>Awaiting reply</FilteredContent>
            )}
          </FilteredWrapper>
        )}
    </>
  )
}

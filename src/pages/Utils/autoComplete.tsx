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
import {
  Container,
  Wrapper,
  ImgWrapper,
  UserImg,
  UserInfo,
  HomeTownText,
} from "../Components/styles/friendStyles"
import queryFriendImg from "../assets/034961magnifying-friends.png"

/* eslint-disable react/jsx-props-no-spreading */

const InputWrapper = styled.div`
  display: flex;
  flex-flow: column wrap;
  align-self: start;
  width: 300px;
  height: 40px;
  line-height: 40px;
  margin: 15px 0px;
  padding: 0;
  align-items: center;
  gap: 8px;
  @media screen and (max-width: 600px), (max-height: 600px) {
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
    outline: 3px solid #7ccbab;
    border: none;
  }
  ::placeholder {
    font-size: 16px;
  }
  @media screen and (max-width: 600px), (max-height: 600px) {
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
  @media screen and (max-width: 600px), (max-height: 600px) {
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
  @media screen and (max-width: 600px), (max-height: 600px) {
    top: 3px;
    left: 4px;
    width: 24px;
    height: 24px;
  }
`

const ResultsSection = styled.div`
  position: absolute;
  top: 85px;
  left: 0px;
  width: calc(100% - 100px);
  margin-left: 50px;
  display: flex;
  flex-flow: column wrap;
  padding: 5px 15px;
  color: #2d2d2d;
  background-color: ${(props) => props.theme.btnColor.bgGreen};
  border-radius: 5px;
  border-top: none;
  z-index: 20;
  @media screen and (max-width: 600px), (max-height: 600px) {
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
  font-size: ${(props) => props.theme.title.lg};
  &:hover {
    color: #e6e6e6;
    background-color: ${(props) => props.theme.color.deepMain};
    border: none;
    border-radius: 5px;
  }
  @media screen and (max-width: 600px), (max-height: 600px) {
    font-size: ${(props) => props.theme.title.md};
  }
`
const Avatar = styled.img`
  margin: 0 10px 0 10px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 2px solid #fff;

  @media screen and (max-width: 600px), (max-height: 600px) {
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
  font-size: ${(props) => props.theme.title.lg};
  @media screen and (max-width: 600px), (max-height: 600px) {
    font-size: ${(props) => props.theme.title.md};
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
  @media screen and (max-width: 600px), (max-height: 600px) {
    line-height: 24px;
    height: 24px;
  }
`
const ResultContent = styled(ResultContentWrapper)`
  display: flex;
  align-items: center;
  padding: 10px 0;
  line-height: 16px;
  font-size: ${(props) => props.theme.title.lg};
  gap: 20px;
  cursor: pointer;
`
const StatusText = styled(NameText)`
  width: 100%;
  line-height: 25px;
  height: 50px;
  justify-content: center;
  text-align: center;
  font-size: 16px;
  margin: 0px;
`

const FilteredWrapper = styled(Wrapper)<{ friendStatus: string }>`
  &:hover {
    border: none;
    border-radius: 5px;
    cursor: ${(props) => props.friendStatus === "alreadyFriend" && "pointer"};
    color: ${(props) => props.friendStatus === "alreadyFriend" && "#fff"};
    background-color: ${(props) =>
      props.friendStatus === "alreadyFriend" && props.theme.color.deepMain};
  }
`

const FilteredContent = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  margin: 2px;
  line-height: 30px;
  height: 30px;
  font-size: ${(props) => props.theme.title.lg};
  @media screen and (max-width: 600px), (max-height: 600px) {
    font-size: ${(props) => props.theme.title.md};
    line-height: 24px;
    height: 24px;
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
  line-height: 30px;
  height: 30px;
  font-size: ${(props) => props.theme.title.md};
  color: #ffffff;
  background-color: ${(props) => props.theme.color.deepMain};
  border-radius: 5px;
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
  font-size: ${(props) => props.theme.title.md};
  color: #ffffff;
  background-color: ${(props) => props.theme.color.deepMain};
  border-radius: 5px;
  cursor: pointer;
`
const BtnDeny = styled(BtnAccept)`
  background-color: ${(props) => props.theme.btnColor.bgGray};
`
const BtnVisitLink = styled(BtnAccept)`
  min-width: 35%;
  margin-right: 10px;
  font-size: ${(props) => props.theme.title.md};
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
  const { currentUser, isLogin, navigate, setCurrentFriendInfo } =
    useContext(AuthContext)
  const [queryResult, setQueryResult] = useState<DocumentData | UserInfoType>()
  const [friendStatus, setFriendStatus] = useState("")
  console.log({ queryResult })
  console.log({ friendStatus })
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
        setQueryResult(docSnap.data())
        console.log(docSnap.data())
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
              ref={qInputRef}
              {...autocomplete.getInputProps({
                inputElement: null,
              })}
              placeholder="Search a user"
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
      {!autocompleteState.isOpen &&
        qInputRef?.current?.value !== "" &&
        !queryResult && (
          <ResultsSection>
            <NoMatchText>No matches found</NoMatchText>
          </ResultsSection>
        )}

      {queryResult && props.invitingIds !== undefined && (
        <FilteredWrapper
          friendStatus={friendStatus}
          onClick={() => {
            if (friendStatus === "alreadyFriend") {
              setCurrentFriendInfo({
                name: queryResult.name,
                id: queryResult.id,
              })
              navigate(
                `/${currentUser?.name}/my-friend/${queryResult.name}/${queryResult.id}`
              )
            }
          }}
        >
          <ImgWrapper>
            <UserImg src={queryResult.photoURL} />
          </ImgWrapper>
          <UserInfo>
            <NameText>{queryResult.name}</NameText>
            <HomeTownText>{queryResult.hometownName}</HomeTownText>
          </UserInfo>
          {friendStatus === "" && queryResult.id !== currentUser?.id && (
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
          {friendStatus === "awaitingReply" && (
            // <FilteredContent>Awaiting reply</FilteredContent>
            <BtnWrapper>
              <StatusText>
                Awaiting
                <br />
                reply
              </StatusText>
            </BtnWrapper>
          )}
          {friendStatus === "alreadyFriend" && (
            <FilteredContent>friends</FilteredContent>
          )}
        </FilteredWrapper>
      )}
    </>
  )
}

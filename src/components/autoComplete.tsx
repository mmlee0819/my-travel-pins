import React, {
  Dispatch,
  SetStateAction,
  useState,
  useRef,
  useEffect,
  useMemo,
  useContext,
} from "react"
import styled, { keyframes } from "styled-components"
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
import { db } from "../utils/firebase"
import { AuthContext } from "../context/authContext"
import { UserImg, HomeTownText } from "./styles/friendStyles"
import queryFriendImg from "../assets/034961magnifying-friends.png"
import xMark from "../assets/buttons/x-mark.png"

/* eslint-disable react/jsx-props-no-spreading */

const appear = keyframes`
  0% {
    opacity: 0;
    transform: scale(0);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }`

const BgOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${(props) => props.theme.color.bgDark};
  border-radius: 5px;
  opacity: 0.97;
  z-index: 50;
`
const VisitArea = styled.div`
  position: absolute;
  bottom: 0px;
  left: 0px;
  display: flex;
  align-items: flex-end;
  width: 100%;
  max-height: 0px;
  overflow: hidden;
  border-radius: 5px;
  background: linear-gradient(rgb(83, 132, 169, 0), rgb(83, 132, 169));
  transform-origin: bottom;
  transition: max-height 0.5s ease-in-out;
`
const VisitText = styled.div`
  margin: 25px 20px 15px 20px;
  width: 100%;
  color: rgb(255, 255, 255);
  font-size: 18px;
  line-height: 20px;
  text-align: center;
`
const ProfileArea = styled.div<{ friendStatus: string }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  width: 300px;
  padding: 30px;
  font-size: ${(props) => props.theme.title.lg};
  font-weight: 700;
  color: ${(props) => props.theme.color.bgDark};
  background-color: ${(props) => props.theme.color.bgLight};
  box-shadow: rgb(120 120 120) 0px 0px 5px;
  border-radius: 5px;
  gap: 30px;
  z-index: 52;
  animation: ${appear} 0.5s ease-in-out;
  &:hover > ${VisitArea} {
    ${(props) =>
      props.friendStatus === "alreadyFriend" &&
      `max-height: 100px;
     cursor: pointer`}
  }
  @media screen and(max-width: 600px), (max-height: 600px) {
    font-size: ${(props) => props.theme.title.md};
  }
`
const Xmark = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
  background-image: url(${xMark});
  background-size: 100% 100%;
  width: 15px;
  height: 15px;
  cursor: pointer;
  z-index: 60;
`

const SelectedUserInfo = styled.div`
  display: flex;
  flex-flow: column wrap;
  align-items: center;
  font-size: ${(props) => props.theme.title.md};
  color: ${(props) => props.theme.color.bgDark};
  border: none;
  gap: 5px;
  @media screen and (max-width: 900px) and (min-width: 600px),
    (max-height: 600px) {
    font-size: ${(props) => props.theme.title.sm};
  }
`

const ImgWrapper = styled.div`
  position: relative;
  display: block;
  width: 150px;
  height: 150px;
  object-fit: cover;
  border: none;
  border-radius: 50%;
`
const SelectedNameText = styled.div`
  display: flex;
  margin-bottom: 10px;
  line-height: 24px;
  height: 24px;
  font-size: ${(props) => props.theme.title.lg};
  @media screen and (max-width: 600px), (max-height: 600px) {
    font-size: ${(props) => props.theme.title.md};
    line-height: 20px;
    height: 20px;
  }
`
const InputWrapper = styled.div`
  display: flex;
  flex-flow: column wrap;
  align-self: start;
  width: 360px;
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
  right: 50px;
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  min-height: 60px;
  min-width: 360px;
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
  margin-right: 10px;
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
  cursor: pointer;
`
const StatusText = styled(NameText)`
  width: 100%;
  line-height: 25px;
  height: 50px;
  justify-content: center;
  text-align: center;
  font-size: 16px;
  color: ${(props) => props.theme.color.deepMain};
  margin: 0px;
`

const StatusWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  gap: 10px;
`
const BtnAccept = styled.div`
  display: flex;
  width: 100px;
  justify-content: center;
  font-size: ${(props) => props.theme.title.md};
  color: #ffffff;
  background-color: ${(props) => props.theme.color.lightMain};
  border-radius: 5px;
  cursor: pointer;
`
const BtnDeny = styled(BtnAccept)`
  background-color: ${(props) => props.theme.btnColor.bgGray};
`
const BtnSendReq = styled(BtnAccept)`
  width: 160px;
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
  const [showUserProfile, setShowUserProfile] = useState(false)
  const [showVisit, setShowVisit] = useState(false)
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
        setQueryResult(docSnap.data())
        setShowUserProfile(true)
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
        autocompleteState?.collections[0]?.items?.length === 0 && (
          <ResultsSection>
            <NoMatchText>No matches found</NoMatchText>
          </ResultsSection>
        )}

      {queryResult && props.invitingIds !== undefined && showUserProfile && (
        <BgOverlay>
          <ProfileArea
            friendStatus={friendStatus}
            onClick={(e) => {
              if ((e.target as HTMLDivElement).id === "closeIcon") return
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
            // onMouseEnter={() => setShowVisit(true)}
            // // onMouseLeave={() => {
            // //   setShowVisit(false)
            // // }}
          >
            {/* <VisitArea friendStatus={friendStatus}>
              <VisitText>Visit</VisitText>
            </VisitArea> */}
            {friendStatus === "alreadyFriend" && (
              <VisitArea>
                <VisitText>Visit</VisitText>
              </VisitArea>
            )}
            <Xmark
              id="closeIcon"
              onClick={() => {
                setShowUserProfile(false)
                setShowVisit(false)
              }}
            />
            <ImgWrapper>
              <UserImg
                src={queryResult.photoURL}
                alt={`${queryResult.name}-avatar`}
              />
            </ImgWrapper>
            <SelectedUserInfo>
              <SelectedNameText>{queryResult.name}</SelectedNameText>
              <HomeTownText>{queryResult.hometownName}</HomeTownText>
              <HomeTownText>{queryResult.email}</HomeTownText>
            </SelectedUserInfo>
            {friendStatus === "" && queryResult.id !== currentUser?.id && (
              <BtnSendReq
                onClick={() => {
                  addFriend(queryResult.id)
                }}
              >
                Add friend
              </BtnSendReq>
            )}
            {friendStatus === "acceptOrDeny" && (
              <StatusWrapper>
                <BtnAccept>Accept</BtnAccept>
                <BtnDeny>Deny</BtnDeny>
              </StatusWrapper>
            )}
            {friendStatus === "awaitingReply" && (
              <StatusWrapper>
                <StatusText>Awaiting reply</StatusText>
              </StatusWrapper>
            )}
            {friendStatus === "alreadyFriend" && (
              <StatusWrapper>
                <StatusText>Friends</StatusText>
              </StatusWrapper>
            )}
          </ProfileArea>
        </BgOverlay>
      )}
    </>
  )
}

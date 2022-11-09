import React from "react"
import styled from "styled-components"
import { useState, useRef, useEffect, useMemo } from "react"
import algoliasearch from "algoliasearch/lite"
import {
  AutocompleteOptions,
  AutocompleteState,
  createAutocomplete,
} from "@algolia/autocomplete-core"
import { getAlgoliaResults } from "@algolia/autocomplete-preset-algolia"
import { Hit } from "@algolia/client-search"
import queryFriendImg from "../assets/034961magnifying-friends.png"

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
  cursor: pointer;
`
const searchClient = algoliasearch(
  "NW2MT84M3G",
  "f31f1435408c2dda975160ac96a5e625"
)
type AutocompleteItem = Hit<{
  photoURL: string
  name: string
  hometownName: string
  email: string
}>

export function Autocomplete(
  props: Partial<AutocompleteOptions<AutocompleteItem>>
) {
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
                        hitsPerPage: 5,
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

  console.log(" qInputRef", qInputRef)

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
              <BtnQueryIcon type="submit" {...autocomplete.getLabelProps({})} />
            </Label>
            <QueryFriendInput
              ref={qInputRef}
              {...autocomplete.getInputProps({
                inputElement: qInputRef.current,
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
                        id={item.objectID}
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
    </>
  )
}

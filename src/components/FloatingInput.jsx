import {
    Box,
    FormControl,
    Input,
    InputGroup,
    Text,
  } from "@chakra-ui/react";
  import { useState } from "react";
  
  export default function FloatingInput({
    label,
    name,
    value,
    onChange,
    isRequired = false,
    type = "text",
    ...rest
  }) {
    const [isActive, setIsActive] = useState(value !== "");
  
    return (
      <Box pos="relative" mt={4}>
        <FormControl isRequired={isRequired}>
          <InputGroup>
            <Input
              id={name}
              name={name}
              type={type}
              value={value}
              onChange={(e) => {
                onChange(e);
                setIsActive(e.target.value !== "");
              }}
              onFocus={() => setIsActive(true)}
              onBlur={() => {
                if (value === "") setIsActive(false);
              }}
              p="5"
              h="40px"
              {...rest}
            />
          </InputGroup>
        </FormControl>
  
        <Text
          as="label"
          htmlFor={name}
          position="absolute"
          top={isActive ? "0%" : "50%"}
          left={isActive ? "5px" : "50%"}
          transform={
            isActive
              ? "translate(10px,-45%) scale(0.8)"
              : "translate(-50%,-50%) scale(1)"
          }
          padding="0 12px"
          bg="#fff"
          transformOrigin="top left"
          transition="all 0.2s ease-out"
          color="#999"
          pointerEvents="none"
          zIndex="5"
          fontSize="sm"
          fontWeight="medium"
          w="fit-content"
          minW="150px"
        >
          {label}
        </Text>
      </Box>
    );
  }
  
"use client";

import axios from "axios";
import { Button, Label, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import InputHelpText, {
  inputStatusColor,
} from "../../components/input-help-text";
import ChatCommandTable from "./table";

const languages = [
  "de",
  "dk",
  "en",
  "es",
  "fr",
  "it",
  "nb",
  "nl",
  "pl",
  "pt_br",
  "ru",
  "sv",
  "tr",
  "zh_tw",
];

export default function ChatCommandsPage(): JSX.Element {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting, isDirty, isSubmitSuccessful },
    reset,
  } = useForm(); // user state for form

  const [formData, setFormData] = useState(null);

  // Fetch config object from server on component load
  useEffect(() => {
    let isLoaded = true;
    axios({
      url: "/api/noalbs/config",
      method: "GET",
    }).then((response) => {
      if (isLoaded) {
        response.data.chat.admins = response.data.chat.admins.join(" ");
        setFormData(response.data);
      }
    });
    return () => {
      isLoaded = false;
    };
  }, []);

  // Reset form when config object is updated
  useEffect(() => {
    reset(formData!, { keepDirty: false });
  }, [formData, reset]);

  const submitForm = async (data: any) => {
    data.chat.admins = data.chat.admins.trim().split(/\s+/);
    return axios({
      url: "/api/noalbs/config",
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(data),
    }).then((response) => {
      // TODO abort if component is unmounted
      response.data.chat.admins = response.data.chat.admins.join(" ");
      setFormData(response.data);
    });
  };

  return (
    <section>
      <header>
        <h1 className="mb-6 text-4xl font-bold dark:text-white">
          Chat Commands
        </h1>
      </header>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit(submitForm)}>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="language">
              Chat language <span className="text-red-600">*</span>
            </Label>
          </div>
          <Select {...register("language", { required: true })}>
            {languages.map((language) => (
              <option key={language} value={language}>
                {language}
              </option>
            ))}
          </Select>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            The selected language will be used by the Twitch chat bot
          </p>
        </div>

        <div>
          <div className="mb-2 block">
            <Label htmlFor="chat.username">
              Twitch username <span className="text-red-600">*</span>
            </Label>
          </div>
          <TextInput
            id="chat.username"
            {...register("chat.username", { required: true, minLength: 1 })}
            type="input"
            placeholder="Twitch username"
            color={inputStatusColor(errors, "chat.username")}
          />
          <InputHelpText errors={errors} name="chat.username">
            Username of the streamer&apos;s Twitch account
          </InputHelpText>
        </div>

        <div>
          <div className="mb-2 block">
            <Label htmlFor="chat.admins">Twitch admin usernames</Label>
          </div>
          <TextInput
            id="chat.admins"
            {...register("chat.admins", {
              pattern: /^s*.+(s+.+)*s*$/,
            })}
            type="input"
            placeholder="admin1 admin2"
          />
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Usernames of the Twitch accounts who should have full access to all
            of the stream server&apos;s chat commands, separated by spaces
          </p>
        </div>

        <div>
          <div className="mb-2 block">
            <Label htmlFor="chat.prefix">
              Chat command prefix character{" "}
              <span className="text-red-600">*</span>
            </Label>
          </div>
          <TextInput
            id="chat.prefix"
            {...register("chat.prefix", {
              required: true,
              minLength: 1,
              maxLength: 1,
            })}
            type="input"
            color={inputStatusColor(errors, "chat.prefix")}
            defaultValue="!"
            placeholder="!"
          />
          <InputHelpText errors={errors} name="chat.prefix">
            Prefix character to use to specify a chat command
          </InputHelpText>
        </div>

        <div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              {...register("chat.enableModCommands")}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
              Enable mod-only commands
            </span>
          </label>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Gives mods permission to use certain chat commands
          </p>
        </div>

        <div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              {...register("chat.enablePublicCommands")}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
              Enable public commands
            </span>
          </label>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Allows anyone to use the <code>!bitrate</code> chat command
          </p>
        </div>

        <div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              {...register("chat.enableAutoStopStreamOnHostOrRaid")}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
              Automatic end stream on host or raid
            </span>
          </label>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Automatically ends the stream if the streamer initiates a raid or
            host
          </p>
        </div>

        <div>
          <Button
            type="submit"
            disabled={isSubmitting || !isDirty}
            className="btn btn-primary mr-1"
          >
            {isSubmitting && (
              <span className="spinner-border spinner-border-sm mr-1"></span>
            )}
            {isSubmitting
              ? "Saving"
              : isSubmitSuccessful || !isDirty
              ? "Saved"
              : "Save"}
          </Button>
        </div>
      </form>

      <div className="mt-8 mb-4">
        <h2 className="mb-6 text-2xl font-extrabold dark:text-white">
          Available Commands
        </h2>
        <ChatCommandTable />
      </div>
    </section>
  );
}
